import _ from 'lodash';
import moment from 'moment';

import varint from 'varint';
import protobuf from "protobufjs";

import Promise from "bluebird";
import RNFS from 'react-native-fs';

import { hexArrayBuffer, base64ArrayBuffer } from '../lib/base64';

// TODO: May want to pass these in. Opportunity for circular dependency.
import * as Types from '../actions/types';

import { WireMessageReply } from './protocol';
import { DataRecord } from './protocol';

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

export function openWriter(device, file, offset, length, dispatch) {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        return Promise.resolve(new DownloadWriter(dataDirectoryPath, device, file, offset, length, dispatch)).then(writer => {
            return writer.open().then(() => {
                console.log("Opened");
                return writer;
            });
        });
    });
}

export class DownloadWriter {
    constructor(dataDirectoryPath, device, file, offset, length, dispatch) {
        this.device = device;
        this.file = file;
        this.dispatch = dispatch;
        this.bytesRead = 0;
        this.started = new Date();
        this.appendChain = Promise.resolve();
        this.throttledDispatch = _.throttle(dispatch, 1000, { leading: true });
        this.readHeader = false;
        this.downloadOffset = offset;
        this.downloadLength = length;
        this.bytesTotal = this.file.size;

        const date = moment(new Date()).format("YYYYMMDD");
        this.directory = dataDirectoryPath + "/" + hexArrayBuffer(device.deviceId) + "/" + date;

        function lpadZeros(value, padding) {
            var zeroes = new Array(padding + 1).join("0");
            return (zeroes + value).slice(-padding);
        }
        const oldTimePrefix = moment(new Date()).format("HHmmss");
        const prefix = lpadZeros(file.version, 6);

        this.path = this.directory + '/' + prefix + "_" + file.name;
        this.headersPath = this.directory + '/' + prefix + "_headers_" + file.name;
    }

    open() {
        return this.fileSystemOp(() => {
            console.log("Opening", this.directory);
            return RNFS.mkdir(this.directory).then(() => {
                return RNFS.exists(this.path);
            }).then(e => {
                if (e) {
                    return RNFS.stat(this.path).then(fileStat => {
                        console.log("Existing", fileStat.size);

                        // If local file is bigger than the expected downloade, we should choose a new file name.
                        let expectedDownloadSize = this.downloadLength;
                        if (expectedDownloadSize == 0) {
                            expectedDownloadSize = this.file.size - this.downloadOffset;
                        }
                        if (fileStat.size > expectedDownloadSize) {
                            return Promise.reject(new Error());
                        }

                        // If local file is smaller, adjust offset.
                        if (fileStat.size <= expectedDownloadSize) {
                            this.downloadOffset += fileStat.size;
                            console.log("Resuming download", this.downloadOffset);
                        }

                        return fileStat;
                    });
                }
                return { };
            });
        });
    }

    appendToFile(data, path) {
        const blockSize = data.length;
        const firstBlock = this.bytesRead == 0;

        this.fileSystemOp(() => {
            const block = base64ArrayBuffer(data);
            if (firstBlock) {
                return RNFS.writeFile(path, block, "base64");
            }
            else {
                return RNFS.appendFile(path, block, "base64");
            }
        });

        this.bytesRead += blockSize;

        this.progress(Types.DOWNLOAD_FILE_PROGRESS);
    }

    append(data) {
        return this.appendToFile(data, this.path);
    }

    write(data) {
        // TODO: Allow header to be split in the middle.
        if (!this.readHeader) {
            const reader = protobuf.Reader.create(data);
            const header = WireMessageReply.decodeDelimited(reader);
            const remaining = data.slice(reader.pos);

            this.readHeader = true;
            this.bytesTotal = header.fileData.size;

            console.log('Header', header);
            console.log("Data", reader.pos, data.length, remaining.length);

            return this.append(remaining);
        }
        else {
            return this.append(data);
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
        const fn = type == Types.DOWNLOAD_FILE_DONE ? this.dispatch : this.throttledDispatch;

        fn({
            type: type,
            download: {
                done: type == Types.DOWNLOAD_FILE_DONE,
                cancelable: true,
                bytesTotal: this.bytesTotal,
                bytesRead: this.bytesRead,
                progress: this.bytesRead / this.bytesTotal,
                started: this.started,
                elapsed: now - this.started,
            }
        });
    }
};
