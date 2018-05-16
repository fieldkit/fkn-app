import varint from 'varint';
import protobuf from "protobufjs";
import moment from 'moment';

import Promise from "bluebird";
import RNFS from 'react-native-fs';

import { hexArrayBuffer, base64ArrayBuffer } from '../lib/base64'

// TODO: May want to pass these in. Opportunity for circular dependency.
import * as Types from '../actions/types';

import { WireMessageReply } from './protocol';

let resolvedDataDirectoryPath = null;

export function resolveDataDirectoryPath() {
    if (resolvedDataDirectoryPath !== null) {
        return resolvedDataDirectoryPath;
    }
    return resolvedDataDirectoryPath = Promise.resolve(RNFS.DocumentDirectoryPath + "/Data").then((path) => {
        return RNFS.mkdir(path).then(() => {
            return path;
        });
    });
}

export function openWriter(device, file, dispatch) {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        return Promise.resolve(new DownloadWriter(dataDirectoryPath, device, file, dispatch)).then(writer => {
            writer.open();
            return writer;
        });
    });
}

export class DownloadWriter {
    constructor(dataDirectoryPath, device, file, dispatch) {
        this.device = device;
        this.file = file;
        this.dispatch = dispatch;
        this.bytesRead = 0;
        this.started = new Date();
        this.appendChain = Promise.resolve();

        const date = moment(new Date()).format("YYYYMMDD");
        const time = moment(new Date()).format("HHmmss");
        this.directory = dataDirectoryPath + "/" + hexArrayBuffer(device.deviceId) + "/" + date;
        this.path = this.directory + '/' + time + "_" + file.name;
    }

    open() {
        return this.fileSystemOp(() => {
            console.log("Creating", this.directory);
            return RNFS.mkdir(this.directory);
        });
    }

    write(data) {
        // TODO: Allow blocks to be split in the middle.
        const reader = protobuf.Reader.create(data);
        while (reader.pos < reader.len) {
            const decoded = WireMessageReply.decodeDelimited(reader);
            if (decoded.fileData == null) {
                console.log("Empty file-data block.");
                console.log(decoded);
                continue;
            }

            const blockSize = decoded.fileData.data.length;
            const firstBlock = this.bytesRead == 0;

            this.fileSystemOp(() => {
                const block = base64ArrayBuffer(decoded.fileData.data);
                if (firstBlock) {
                    return RNFS.writeFile(this.path, block, "base64");
                }
                else {
                    return RNFS.appendFile(this.path, block, "base64");
                }
            });

            this.bytesRead += blockSize;

            this.progress(Types.DOWNLOAD_FILE_PROGRESS);
        }
    }

    close() {
        this.progress(Types.DOWNLOAD_FILE_DONE);

        this.fileSystemOp(() => {
            return RNFS.readDir(RNFS.DocumentDirectoryPath).then((res) => {
                console.log('Directory', res);
            });
        });

        return {};
    }

    fileSystemOp(resolve) {
        return this.appendChain = this.appendChain.then(resolve);
    }

    progress(type) {
        const now = new Date();

        this.dispatch({
            type: type,
            download: {
                done: type == Types.DOWNLOAD_FILE_DONE,
                cancelable: true,
                bytesTotal: this.file.size,
                bytesRead: this.bytesRead,
                progress: this.bytesRead / this.file.size,
                started: this.started,
                elapsed: now - this.started,
            }
        });
    }
};
