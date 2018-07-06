import _ from 'lodash';
import moment from 'moment';
import Promise from "bluebird";
import RNFS from 'react-native-fs';

import * as Types from './types';

import * as Files from '../lib/files';
import { Toasts } from '../lib/toasts';

import { resolveDataDirectoryPath } from '../lib/downloading';
import { uploadFile } from '../lib/uploading';

import { navigateBrowser } from './navigation';

function getDirectory(relativePath) {
    return resolveDataDirectoryPath().then((dataDirectoryPath) => {
        const path = dataDirectoryPath + relativePath;
        console.log("Reading", path);
        return RNFS.stat(path).then(info => {
            if (info.isFile()) {
                return {
                    type: Types.NOOP,
                    path: path,
                };
            }

            return RNFS.readDir(path).then((res) => {
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

function walkDirectory(relativePath, dispatch) {
    return getDirectory(relativePath).then(action => {
        dispatch(action);

        _.each(action.listing, (entry) => {
            if (entry.directory) {
                walkDirectory(entry.relativePath, dispatch);
            }
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

export function findAllFiles() {
    return (dispatch) => {
        walkDirectory("/", dispatch);
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

export function uploadLocalFile(relativePath) {
    return (dispatch) => {
        return uploadFile(relativePath);
    };
}
