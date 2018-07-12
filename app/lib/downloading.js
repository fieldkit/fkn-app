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

export function createDataDirectoryPath() {
    return resolvedDataDirectoryPath = Promise.resolve(RNFS.DocumentDirectoryPath + "/Data").then((path) => {
        return RNFS.mkdir(path).then(() => {
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
                console.log("Opened");
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
        const path = directory + "/" + "metadata.fkpb";

        console.log("Writing metadata");

        return RNFS.touch(path, new Date()).then(() => {
            const block = base64ArrayBuffer(metadata);
            return RNFS.appendFile(path, block, "base64");
        });
    });
}

export class DownloadWriter {
    constructor(dataDirectoryPath, device, file, settings, dispatch) {
        this.device = device;
        this.file = file;
        this.settings = settings;
        this.dispatch = dispatch;

        this.readHeader = false;
        this.started = new Date();
        this.appendChain = Promise.resolve();
        this.throttledDispatch = _.throttle(dispatch, 1000, { leading: true });

        this.bytesRead = 0;
        this.bytesTotal = this.file.size;

        const now = moment(new Date());
        this.date = now.format("YYYYMMDD");
        this.time = now.format("HHmmss");
        this.versionPrefix = lpadZeros(file.version, 6);
        this.directory = dataDirectoryPath + "/" + hexArrayBuffer(device.deviceId);
        this.headersPath = this.directory + '/' + this.versionPrefix + "_headers_" + this.file.name;
        this.resumePath = this.directory + '/' + this.versionPrefix + "_" + this.file.name;
        this.stampedPath = this.directory + '/' + this.versionPrefix + "_" + this.time + "_" + this.file.name;
    }

    selectFileNameAndSettings(existing) {
        // If we're not resuming, just return timestamped path for now.
        if (!this.settings.resume) {
            return Promise.resolve(this.stampedPath);
        }

        // If no existing file, just go ahead.
        if (existing == null) {
            return Promise.resolve(this.resumePath);
        }

        console.log("Existing", this.settings.offset);

        // Calculate the size of the file we're expecting to get. Either the
        // given limited length or the size of the file after the offset.
        let expectedDownloadSize = this.settings.length;
        if (expectedDownloadSize == 0) {
            expectedDownloadSize = this.file.size - this.settings.offset;
        }

        // If local file is bigger than the expected download for some reason, timestamp old file.
        if (existing.size > expectedDownloadSize) {
            console.log("Renaming", this.resumePath, this.stampedPath);
            return RNFS.moveFile(this.resumePath, this.stampedPath).then(() => {
                return Promise.resolve(this.resumePath);
            });
        }
        // If local file is smaller, adjust offset to resume.
        else {
            this.settings.offset += existing.size;
        }

        return Promise.resolve(this.resumePath);
    }

    open() {
        return this.fileSystemOp(() => {
            return RNFS.mkdir(this.directory).then(() => {
                return fileStatIfExists(this.resumePath).then(resumeFile => {
                    return this.selectFileNameAndSettings(resumeFile);
                });
            }).then(path => {
                console.log("Path", path);
                return this.path = path;
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
            const block = base64ArrayBuffer(data);
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
