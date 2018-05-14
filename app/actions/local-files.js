import _ from 'lodash';
import moment from 'moment';
import Promise from "bluebird";
import RNFS from 'react-native-fs';

import * as Types from './types';

import * as Files from '../lib/files';

import { resolveDataDirectoryPath } from '../lib/downloading';

export function browseDirectory(relativePath) {
    return (dispatch, getState) => {
        return resolveDataDirectoryPath().then((dataDirectoryPath) => {
            const path = dataDirectoryPath + relativePath;
            console.log("Reading", path);
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

                dispatch({
                    type: Types.LOCAL_FILES_BROWSE,
                    relativePath: relativePath,
                    path: path,
                    listing: listing
                })
            });
        });
    }
}

export function deleteLocalFile(relativePath) {
    return (dispatch, getState) => {
        return resolveDataDirectoryPath().then((dataDirectoryPath) => {
            const path = dataDirectoryPath + relativePath;
            return RNFS.unlink(path).then(() => {
                return browseDirectory(Files.getParentPath(path));
            });
        });
    };
}

export function uploadLocalFile(relativePath) {
    const baseUri = "http://192.168.0.141:8080"; // "http://api.fkdev.org";
    const uploadPath = "/messages/ingestion/stream";
    const mimeType = 'application/vnd.fk.data+base64';

    return (dispatch, getState) => {
        return resolveDataDirectoryPath().then((dataDirectoryPath) => {
            const path = dataDirectoryPath + relativePath;
            return RNFS.readFile(path, 'base64');
        }).then((data) => {
            console.log(data);

            return fetch(baseUri + uploadPath, {
                'method': 'POST',
                'headers': {
                    'Content-Type': mimeType
                },
                'body': data
            });
        });
    }
}
