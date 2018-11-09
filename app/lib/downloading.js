import _ from 'lodash';
import moment from 'moment';

import varint from 'varint';
import protobuf from "protobufjs";

import Promise from "bluebird";
import RNFS from 'react-native-fs';

import { hexArrayBuffer, arrayBufferToBase64 } from '../lib/base64';

// TODO: May want to pass these in. Opportunity for circular dependency.
import * as Types from '../actions/types';

import { WireMessageReply } from './protocol';

import * as Files from './files';

let resolvedDataDirectoryPath = null;

export function createDataDirectoryPath() {
    return resolvedDataDirectoryPath = Promise.resolve(RNFS.DocumentDirectoryPath + "/Data").then((path) => {
        return RNFS.mkdir(path).then(() => {
            console.log("Created", path);
            return path;
        });
    });
}

export function resolveDataDirectoryPath() {
    if (resolvedDataDirectoryPath !== null) {
        return resolvedDataDirectoryPath;
    }
    return createDataDirectoryPath();
}

export function openWriter(device, file, settings, dispatch) {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        return Promise.resolve(new DownloadWriter(dataDirectoryPath, device, file, settings, dispatch)).then(writer => {
            return writer.open().then(() => {
                return writer;
            });
        });
    });
}

function lpadZeros(value, padding) {
    var zeroes = new Array(padding + 1).join("0");
    return (zeroes + value).slice(-padding);
}

function fileStatIfExists(path) {
    return RNFS.exists(path).then(e => {
        if (e) {
            return RNFS.stat(path).then(info => {
                return info;
            });
        }
        return null;
    });
}

export class LocalFileStructure {
    constructor(dataDirectoryPath, device) {
    }
}

export function writeDeviceMetadata(device, metadata) {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        const directory = dataDirectoryPath + "/" + hexArrayBuffer(device.deviceId);

        return RNFS.mkdir(directory).then(() => {
            const path = directory + "/" + "metadata.fkpb";

            console.log("Writing metadata");

            return RNFS.touch(path, new Date()).then(() => {
                const block = arrayBufferToBase64(metadata);
                return RNFS.appendFile(path, block, "base64");
            });
        });
    });
}

export class DownloadWriter {
    constructor(dataDirectoryPath, device, file, settings, dispatch) {
        this.device = device;
        this.file = file;
        this.settings = settings;
        this.dispatch = dispatch;
        this.dataDirectoryPath = dataDirectoryPath;

        this.readHeader = false;
        this.started = new Date();
        this.appendChain = Promise.resolve();
        this.throttledDispatch = _.throttle(dispatch, 1000, { leading: true });

        this.bytesRead = 0;
        this.bytesTotal = this.file.size;
    }

    open() {
        return this.fileSystemOp(() => {
            return Promise.resolve(true).then(() => {
                console.log('settings', this.settings);
                this.headersPath = this.dataDirectoryPath + "/" + this.settings.paths.headers;
                this.path = this.dataDirectoryPath + "/" + this.settings.paths.file;
                this.directory = Files.getParentPath(this.path);
                console.log("Making", this.directory);
                return RNFS.mkdir(this.directory);
            }).then(() => {
                // We touch all the files here so we can just use append all the time down below.
                return Promise.all([ this.path, this.headersPath ].map(p => {
                    return RNFS.touch(p, new Date());
                }));
            });
        });
    }

    appendToFile(data, path) {
        this.fileSystemOp(() => {
            const block = arrayBufferToBase64(data);
            return RNFS.appendFile(path, block, "base64");
        });
    }

    append(data) {
        this.appendToFile(data, this.path);

        const blockSize = data.length;
        this.bytesRead += blockSize;
        this.progress(Types.DOWNLOAD_FILE_PROGRESS);
    }

    write(data) {
        // TODO: Allow header to be split in the middle.
        if (!this.readHeader) {
            const reader = protobuf.Reader.create(data);
            const header = WireMessageReply.decodeDelimited(reader);
            const remaining = data.slice(reader.pos);
            const headerData = data.slice(0, reader.pos);

            this.readHeader = true;
            this.bytesTotal = header.fileData.size;

            console.log('Header', header, headerData.length);

            this.appendToFile(headerData, this.headersPath);

            return this.append(remaining);
        }
        else {
            return this.append(data);
        }
    }

    close() {
        this.progress(Types.DOWNLOAD_FILE_DONE);

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
