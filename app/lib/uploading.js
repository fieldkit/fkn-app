import _ from 'lodash';
import moment from 'moment';

import varint from 'varint';
import protobuf from "protobufjs";

import Promise from "bluebird";
import RNFS from 'react-native-fs';

import { Toasts } from '../lib/toasts';
import { hexArrayBuffer, base64ArrayBuffer } from '../lib/base64';

import Config from '../config';

import { resolveDataDirectoryPath } from './downloading';

export function uploadFile(relativePath) {
    const baseUri = config.baseUri;
    const uploadPath = "/messages/ingestion/stream";
    const mimeType = 'application/vnd.fk.data+base64';

    return resolveDataDirectoryPath().then((dataDirectoryPath) => {
        const path = dataDirectoryPath + relativePath;
        console.log("Reading", path);
        return RNFS.readFile(path, 'base64');
    }).then((data) => {
        console.log("Uploading");
        return fetch(baseUri + uploadPath, {
            'method': 'POST',
            'headers': {
                'Content-Type': mimeType
            },
            'body': data
        }).then((res) => {
            console.log("Done!", res);
            Toasts.show('Upload completed!');
        });
    });
}
