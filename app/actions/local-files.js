import _ from 'lodash';
import moment from 'moment';
import Promise from "bluebird";
import RNFS from 'react-native-fs';

import * as Types from './types';

import { Toasts } from '../lib/toasts';
import * as Files from '../lib/files';

import { resolveDataDirectoryPath, createDataDirectoryPath } from '../lib/downloading';
import { uploadFile } from '../lib/uploading';
import { readAllDataRecords } from '../lib/data-files';

import { navigateBrowser, navigateLocalFile, navigateOpenFile } from './navigation';

function toDisplayModel(entry) {
    if (entry.directory) {
        return entry;
    }

    const info = Files.getFileInformation(entry);
    if (!_.isObject(info)) {
        return entry;
    }

    return {
        name: info.name,
        path: entry.path,
        relativePath: entry.relativePath,
        size: entry.size,
        created: entry.created,
        modified: entry.modified,
        modifiedPretty: entry.modifiedPretty,
        directory: entry.directory,
    };
}

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


            function toEntry(e) {
                const modifiedPretty = moment(e.mtime).format("MMM D YYYY h:MM:ss");

                return {
                    name: e.name,
                    path: e.path,
                    relativePath: e.path.replace(dataDirectoryPath, ""),
                    size: e.size,
                    created: e.ctime,
                    modified: e.mtime,
                    modifiedPretty: modifiedPretty,
                    directory: e.isDirectory(),
                };
            }

            return RNFS.readDir(actual).then((res) => {
                const listing = _(res).map(toEntry).map(toDisplayModel).value();

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

export function browseFile(relativePath) {
    return (dispatch) => {
        return getDirectory(relativePath).then(action => {
            dispatch(navigateLocalFile(relativePath));
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

export function touchLocalFile(relativePath) {
    return (dispatch) => {
        return resolveDataDirectoryPath().then((dataDirectoryPath) => {
            const directory = Files.getParentPath(relativePath);
            return RNFS.mkdir(dataDirectoryPath + "/" + directory).then(() => {
                console.log("Touching", relativePath);
                return RNFS.touch(dataDirectoryPath + "/" + relativePath, new Date()).then(() => {
                    return browseDirectory(directory);
                });
            });
        });
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

export function openLocalFile(relativePath) {
    return (dispatch) => {
        dispatch(navigateOpenFile(relativePath));

        return resolveDataDirectoryPath().then((dataDirectoryPath) => {
            return RNFS.readFile(dataDirectoryPath + relativePath, 'base64').then((data) => {
                const records = readAllDataRecords(data);
                dispatch({
                    type: Types.LOCAL_FILES_RECORDS,
                    relativePath: relativePath,
                    records: records
                });
            });
        });
    };
}

export function uploadLocalFile(relativePath, headers) {
    return (dispatch) => {
        return uploadFile(relativePath, headers);
    };
}
