import _ from "lodash";

import Promise from "bluebird";
import RNFS from "react-native-fs";

import Config from "../config";

import { resolveDataDirectoryPath } from "./downloading";
import * as Files from "./files";

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

export function uploadFile(relativePath, userHeaders, progressCallback) {
    const baseUri = Config.baseUri;
    const uploadPath = "/messages/ingestion/stream";
    const mimeType = "application/vnd.fk.data+binary";

    console.log("UserHeaders", userHeaders);

    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        const path = dataDirectoryPath + relativePath;
        const headers = makeHeaders(userHeaders);

        const files = [
            {
                filename: Files.getPathName(path),
                filepath: path,
                filetype: mimeType
            }
        ];

        const url = baseUri + uploadPath;

        console.log("Uploading", url, files, headers);

        return RNFS.uploadFiles({
            toUrl: url,
            files: files,
            method: "POST",
            headers: headers,
            begin: response => {
                console.log("Begin", response);
            },
            progress: response => {
                progressCallback(response);
            }
        })
            .promise.then(response => {
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
