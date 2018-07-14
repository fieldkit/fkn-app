import _ from 'lodash';
import moment from 'moment';
import Promise from "bluebird";
import RNFS from 'react-native-fs';

import * as Types from './types';

import * as Files from '../lib/files';
import { Toasts } from '../lib/toasts';

import { resolveDataDirectoryPath, createDataDirectoryPath } from '../lib/downloading';
import { uploadFile } from '../lib/uploading';

import { navigateBrowser } from './navigation';

function getDirectory(relativePath) {
    return resolveDataDirectoryPath().then((dataDirectoryPath) => {
        const path = dataDirectoryPath + relativePath;
        const actual = path.replace(/\/$/, "");
        return RNFS.stat(actual).then(info => {
            if (info.isFile()) {
                return {
                    type: Types.NOOP,
                    path: path,
                };
            }

            return RNFS.readDir(actual).then((res) => {
                const listing = _(res).map(e => {
                    return {
                        name: e.name,
                        path: e.path,
                        relativePath: e.path.replace(dataDirectoryPath, ""),
                        size: e.size,
                        created: e.ctime,
                        modified: e.mtime,
                        directory: e.isDirectory(),
                    };
                }).value();

                return {
                    type: Types.LOCAL_FILES_BROWSE,
                    relativePath: relativePath,
                    path: path,
                    listing: listing
                };
            });
        });
    });
}

function walkDirectory(relativePath, dispatch, callback) {
    return getDirectory(relativePath).then(action => {
        return callback(action.listing).then(() => {
            dispatch(action);

            return Promise.all(_.map(action.listing, (entry) => {
                if (entry.directory) {
                    return walkDirectory(entry.relativePath, dispatch, callback);
                }
                return Promise.resolve(false);
            }));
        });
    });
}

export function browseDirectory(relativePath) {
    return (dispatch) => {
        return getDirectory(relativePath).then(action => {
            dispatch(action);
            dispatch(navigateBrowser(relativePath));
        });
    };
}

export function deleteAllLocalFiles() {
    return (dispatch) => {
        dispatch({
            type: Types.LOCAL_FILES_DELETING_ALL
        });

        return resolveDataDirectoryPath().then(dataDirectoryPath => {
            console.log("Deleting");
            return RNFS.unlink(dataDirectoryPath).then(() => {
                console.log("Refreshing");
                return createDataDirectoryPath().then(() => {
                    return walkDirectory("/", dispatch, () => Promise.resolve(true));
                });
            });
        }).then(() => {
            return findAllFiles()(dispatch);
        });
    };
}

export function archiveAllLocalFiles() {
    return (dispatch) => {
        dispatch({
            type: Types.LOCAL_FILES_ARCHIVING_ALL
        });

        return walkDirectory("/", dispatch, listing => {
            return Promise.all(_.map(listing, (entry) => {
                if (entry.directory) {
                    return Promise.resolve(false);
                }
                return archiveLocalFile(entry.relativePath)(dispatch);
            }));
        }).then(() => {
            return findAllFiles()(dispatch);
        });
    };
}

export function findAllFiles() {
    return (dispatch) => {
        dispatch({
            type: Types.LOCAL_FILES_FINDING_ALL
        });

        return walkDirectory("/", dispatch, () => Promise.resolve(true));
    };
}

export function archiveLocalFile(relativePath) {
    return (dispatch) => {
        return resolveDataDirectoryPath().then((dataDirectoryPath) => {
            const oldPath = dataDirectoryPath + relativePath;
            const archivePath = Files.getParentPath(oldPath) + "/archive/";
            const newPath = archivePath + Files.getPathName(relativePath);
            return RNFS.mkdir(archivePath).then(() => {
                console.log("Archiving", relativePath, "from", oldPath, "to", newPath);
                return RNFS.moveFile(oldPath, newPath).then(() => {
                    console.log("Done");
                    return browseDirectory(Files.getParentPath(oldPath));
                });
            });
        });
    };
}

export function deleteLocalFile(relativePath) {
    return (dispatch) => {
        return resolveDataDirectoryPath().then((dataDirectoryPath) => {
            const path = dataDirectoryPath + relativePath;
            console.log("Deleting", path);
            return RNFS.unlink(path).then(() => {
                return browseDirectory(Files.getParentPath(path));
            });
        });
    };
}

export function uploadLocalFile(relativePath, headers) {
    return (dispatch) => {
        return uploadFile(relativePath, headers);
    };
}
