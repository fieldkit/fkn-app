import _ from "lodash";

import Promise from "bluebird";
import RNFS from "react-native-fs";

import Config from "../config";

import { resolveDataDirectoryPath } from "./downloading";
import * as Files from "./files";

import * as Types from "../actions/types";

function makeHeaders(headers) {
    return _({ ...headers, ...Config.build })
        .map((value, key) => {
            if (_.isUndefined(value)) {
                return [];
            }
            return ["Fk-" + _.upperFirst(key), String(value)];
        })
        .filter(pair => pair.length)
        .fromPairs()
        .value();
}

export function uploadFile(relativePath, userHeaders, progress) {
    const baseUri = Config.baseUri;
    const uploadPath = "/messages/ingestion/stream";
    const mimeType = "application/vnd.fk.data+binary";
    const throttledProgress = _.throttle(progress, 100, { leading: true });

    console.log("UserHeaders", userHeaders);

    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        const path = dataDirectoryPath + relativePath;
        const url = baseUri + uploadPath;
        const started = new Date();
        const headers = makeHeaders(userHeaders);
        const files = [
            {
                filename: Files.getPathName(path),
                filepath: path,
                filetype: mimeType
            }
        ];

        console.log("Uploading", url, files, headers);

        const options = {
            toUrl: url,
            files: files,
            method: "POST",
            headers: headers,
            begin: data => {
                console.log("Begin", data);
            },
            progress: info => {
                const bytesTotal = info.totalBytesExpectedToSend;
                const bytesRead = info.totalBytesSent;
                const now = new Date();

                throttledProgress({
                    type: Types.DOWNLOAD_FILE_PROGRESS,
                    download: {
                        done: false,
                        cancelable: false,
                        bytesTotal: bytesTotal,
                        bytesRead: bytesRead,
                        progress: bytesRead / bytesTotal,
                        started: started,
                        elapsed: now - started
                    }
                });
            }
        };

        return RNFS.uploadFiles(options).promise
            .then(response => {
                const now = new Date();
                progress({
                    type: Types.DOWNLOAD_FILE_DONE,
                    download: {
                        done: true,
                        cancelable: false,
                        bytesTotal: 0,
                        bytesRead: 0,
                        progress: 1.0,
                        started: started,
                        elapsed: now - started
                    }
                });

                console.log("Done", response.statusCode, response.body);
                if (response.statusCode != 200) {
                    return Promise.reject(new Error(response.body));
                }
                return response.body;
            })
            .catch(err => {
                console.log("Failed", err);
                return Promise.reject(err);
            });
    });
}
