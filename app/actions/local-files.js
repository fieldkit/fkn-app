import _ from "lodash";
import moment from "moment";
import Promise from "bluebird";
import RNFS from "react-native-fs";

import * as Types from "./types";

import { Toasts } from "../lib/toasts";
import * as Files from "../lib/files";

import { getDirectory, resolveDataDirectoryPath, createDataDirectoryPath } from "../lib/downloading";
import { uploadFile } from "../lib/uploading";
import { readAllDataRecords } from "../lib/data-files";

import { navigateBrowser, navigateLocalFile, navigateOpenFile, navigateDataMap } from "./navigation";

import { rollover, getArchivedLogs, deleteArchivedLogs } from "../lib/logging";

import Config from "../config";

function walkDirectory(relativePath, dispatch, callback) {
    return getDirectory(relativePath).then(action => {
        return callback(action.listing).then(() => {
            dispatch(action);

            return Promise.all(
                _.map(action.listing, entry => {
                    if (entry.directory) {
                        return walkDirectory(entry.relativePath, dispatch, callback);
                    }
                    return Promise.resolve(false);
                })
            );
        });
    });
}

export function browseDirectory(relativePath) {
    return dispatch => {
        return getDirectory(relativePath).then(action => {
            dispatch(action);
            dispatch(navigateBrowser(relativePath));
        });
    };
}

export function browseFile(relativePath) {
    return dispatch => {
        return getDirectory(relativePath).then(action => {
            dispatch(navigateLocalFile(relativePath));
        });
    };
}

export function deleteAllLocalFiles() {
    return dispatch => {
        dispatch({
            type: Types.LOCAL_FILES_DELETING_ALL
        });

        return resolveDataDirectoryPath()
            .then(dataDirectoryPath => {
                console.log("Deleting");
                return RNFS.unlink(dataDirectoryPath).then(() => {
                    console.log("Refreshing");
                    return createDataDirectoryPath().then(() => {
                        return walkDirectory("/", dispatch, () => Promise.resolve(true));
                    });
                });
            })
            .then(() => {
                return findAllFiles()(dispatch);
            });
    };
}

export function archiveAllLocalFiles() {
    return dispatch => {
        dispatch({
            type: Types.LOCAL_FILES_ARCHIVING_ALL
        });

        return walkDirectory("/", dispatch, listing => {
            return Promise.all(
                _.map(listing, entry => {
                    if (entry.directory) {
                        return Promise.resolve(false);
                    }
                    return archiveLocalFile(entry.relativePath)(dispatch);
                })
            );
        }).then(() => {
            return findAllFiles()(dispatch);
        });
    };
}

export function findAllFiles() {
    return dispatch => {
        dispatch({
            type: Types.LOCAL_FILES_FINDING_ALL
        });

        return walkDirectory("/", dispatch, () => Promise.resolve(true));
    };
}

export function touchLocalFile(relativePath) {
    return dispatch => {
        return resolveDataDirectoryPath().then(dataDirectoryPath => {
            const directory = Files.getParentPath(relativePath);
            return RNFS.mkdir(dataDirectoryPath + "/" + directory).then(() => {
                console.log("Touching", relativePath);
                return RNFS.appendFile(dataDirectoryPath + "/" + relativePath, "", "base64").then(() => {
                    return browseDirectory(directory);
                });
            });
        });
    };
}

export function renameLocalDirectory(fromPath, toPath) {
    return dispatch => {
        return resolveDataDirectoryPath().then(dataDirectoryPath => {
            const oldPath = dataDirectoryPath + fromPath;

            return RNFS.readDir(oldPath)
                .then(oldFiles => {
                    return Promise.all(
                        _(oldFiles)
                            .map(oldFile => {
                                const newPath = dataDirectoryPath + toPath + "/" + oldFile.name;
                                console.log("Moving", oldFile.path, newPath, oldFile.size);
                                return RNFS.moveFile(oldFile.path, newPath);
                            })
                            .value()
                    );
                })
                .then(() => {
                    console.log("Renamed", fromPath, toPath);
                    return browseDirectory(Files.getParentPath(toPath));
                });
        });
    };
}

export function archiveLocalFile(relativePath) {
    return dispatch => {
        return resolveDataDirectoryPath().then(dataDirectoryPath => {
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
    return dispatch => {
        return resolveDataDirectoryPath().then(dataDirectoryPath => {
            const path = dataDirectoryPath + relativePath;
            console.log("Deleting", path);
            return RNFS.exists(path).then(e => {
                if (e) {
                    return RNFS.unlink(path).then(() => {
                        return browseDirectory(Files.getParentPath(path));
                    });
                }
                return false;
            });
        });
    };
}

export function openLocalFile(relativePath) {
    return dispatch => {
        dispatch(navigateOpenFile(relativePath));
        return resolveDataDirectoryPath().then(dataDirectoryPath => {
            return RNFS.readFile(dataDirectoryPath + relativePath, "base64").then(data => {
                return RNFS.readFile(dataDirectoryPath + relativePath, "base64").then(data => {
                    const records = readAllDataRecords(data);
                    dispatch({
                        type: Types.LOCAL_FILES_RECORDS,
                        relativePath: relativePath,
                        records: records
                    });
                });
            });
        });
    };
}

export function openDataMap(relativePath) {
    return dispatch => {
        dispatch(navigateDataMap(relativePath));

        return resolveDataDirectoryPath().then(dataDirectoryPath => {
            return RNFS.readFile(dataDirectoryPath + relativePath, "base64").then(data => {
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

export function uploadLocalFile(relativePath) {
    return dispatch => {
        const started = new Date();

        function getHeaders(fileInfo) {
            if (_.isObject(fileInfo)) {
                return {
                    deviceId: fileInfo.deviceId,
                    fileId: fileInfo.fileId,
                    fileOffset: fileInfo.offset,
                    fileVersion: fileInfo.version,
                    fileName: fileInfo.name,
                    uploadName: fileInfo.entry.name
                };
            }
            return {};
        }

        function progress(action) {
            dispatch(action);
        }

        return getDirectory(Files.getParentPath(relativePath)).then(files => {
            const fileEntry = _(files.listing)
                .filter(entry => entry.relativePath === relativePath)
                .first();
            const fileInfo = Files.getFileInformation(fileEntry);
            const headers = getHeaders(fileInfo);
            return uploadFile(relativePath, headers, progress);
        });
    };
}

export function uploadLogs() {
    return dispatch => {
        function getHeaders(fileInfo) {
            return {
                fileId: "6",
                deviceId: Config.logsDeviceId,
                fileName: "app-logs.fkpb",
                uploadName: fileInfo.name
            };
        }

        function progress(files, action) {
            const active = _(files)
                .filter(f => f.relativePath == action.download.relativePath)
                .first();

            if (action.download.done) {
                active.progress = {
                    bytesRead: active.size
                };
            } else {
                active.progress = {
                    bytesRead: action.download.bytesRead
                };
            }

            const total = _(files)
                .map(f => f.size)
                .sum();
            const uploaded = _(files)
                .map(f => f.progress || { bytesRead: 0 })
                .map(f => f.bytesRead)
                .sum();

            dispatch({
                type: total === uploaded ? Types.DOWNLOAD_FILE_DONE : Types.DOWNLOAD_FILE_PROGRESS,
                download: {
                    done: false,
                    cancelable: false,
                    bytesTotal: total,
                    bytesRead: uploaded,
                    progress: uploaded / total,
                    started: 0,
                    elapsed: 0
                }
            });
        }

        return rollover()
            .then(() => getArchivedLogs())
            .then(files => {
                return _(files).reduce((promise, file) => {
                    return promise.then(values => {
                        return uploadFile(file.relativePath, getHeaders(file), update => progress(files, update)).then(value => {
                            return [...values, ...[file]];
                        });
                    });
                }, Promise.resolve([]));
            })
            .then(files => console.log(files))
            .then(() => {
                console.log("DONE");
                dispatch({
                    type: Types.DOWNLOAD_FILE_DONE,
                    download: {
                        done: true,
                        progress: 1.0,
                        cancelable: false
                    }
                });
            });
    };
}
