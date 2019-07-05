import _ from "lodash";
import moment from "moment";

import varint from "varint";
import protobuf from "protobufjs";

import Promise from "bluebird";
import RNFS from "react-native-fs";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

// TODO: May want to pass these in. Opportunity for circular dependency.
import * as Types from "../actions/types";

import { WireMessageReply } from "./protocol";

import * as Files from "./files";

let resolvedDataDirectoryPath = null;

export function createDataDirectoryPath() {
    return (resolvedDataDirectoryPath = Promise.resolve(RNFS.DocumentDirectoryPath + "/Data").then(path => {
        return RNFS.mkdir(path).then(() => {
            console.log("Created", path);
            return path;
        });
    }));
}

export function resolveDataDirectoryPath() {
    if (resolvedDataDirectoryPath !== null) {
        return resolvedDataDirectoryPath;
    }
    return createDataDirectoryPath();
}

function toDisplayModel(entry) {
    if (entry.directory) {
        return entry;
    }

    const info = Files.getFileInformation(entry);
    if (!_.isObject(info)) {
        return entry;
    }

    return {
        name: info.name,
        path: entry.path,
        relativePath: entry.relativePath,
        size: entry.size,
        created: entry.created,
        modified: entry.modified,
        modifiedPretty: entry.modifiedPretty,
        directory: entry.directory
    };
}

export function getDirectory(relativePath) {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        const path = dataDirectoryPath + relativePath;
        const actual = path.replace(/\/$/, "");

        return RNFS.stat(actual).then(info => {
            if (info.isFile()) {
                return {
                    type: Types.NOOP,
                    path: path
                };
            }

            function toEntry(e) {
                const modifiedPretty = moment(e.mtime).format("MMM D YYYY h:mm:ss");

                return {
                    name: e.name,
                    path: e.path,
                    relativePath: e.path.replace(dataDirectoryPath, ""),
                    size: e.size,
                    created: e.ctime,
                    modified: e.mtime,
                    modifiedPretty: modifiedPretty,
                    directory: e.isDirectory()
                };
            }

            return RNFS.readDir(actual).then(res => {
                const listing = _(res)
                    .map(toEntry)
                    .map(toDisplayModel)
                    .sortBy(o => o.modified)
                    .reverse()
                    .value();

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
    constructor(dataDirectoryPath, device) {}
}

export function writeDeviceMetadata(device, metadata) {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        const directory = dataDirectoryPath + "/" + hexArrayBuffer(device.deviceId);

        return RNFS.mkdir(directory).then(() => {
            const path = directory + "/" + "metadata.fkpb";

            console.log("Writing metadata");

            const block = arrayBufferToBase64(metadata);
            return RNFS.appendFile(path, block, "base64");
        });
    });
}

export class DownloadWriter {
    constructor(dataDirectoryPath, device, file, settings, dispatch) {
        // this.device = device;
        this.file = file;
        this.settings = settings;
        this.dispatch = dispatch;
        this.dataDirectoryPath = dataDirectoryPath;

        this.readHeader = false;
        this.started = new Date();
        this.appendChain = Promise.resolve();
        this.throttledDispatch = _.throttle(dispatch, 1000, { leading: true });

        this.bytesRead = 0;
        this.bytesWritten = 0;
        this.bytesTotal = this.file.size;
        this.pending = 0;
        this.buffer = new Uint8Array(0);
        this.bufferSize = 65536 * 0.5;

        this.headersPath = this.dataDirectoryPath + "/" + this.settings.paths.headers;
        this.path = this.dataDirectoryPath + "/" + this.settings.paths.file;
    }

    open() {
        return this.fileSystemOp(() => {
            return Promise.resolve(true)
                .then(() => {
                    console.log("Settings", this.settings);
                    this.directory = Files.getParentPath(this.path);
                    return RNFS.mkdir(this.directory);
                })
                .then(() => {
                    // We touch all the files here so we can just use append all the time down below.
                    return Promise.all(
                        [this.path, this.headersPath].map(p => {
                            return RNFS.appendFile(p, "", "base64");
                        })
                    );
                });
        });
    }

    appendToFile(data, path, closing) {
        this.fileSystemOp(() => {
            const block = arrayBufferToBase64(data);
            return RNFS.appendFile(path, block, "base64").then(() => {
                const blockSize = data.length;
                this.bytesWritten += blockSize;
                if (!_.isUndefined(closing)) {
                    this.progress(closing ? Types.DOWNLOAD_FILE_DONE : Types.DOWNLOAD_FILE_PROGRESS);
                }
            });
        });
    }

    concatenate(resultConstructor, ...arrays) {
        let totalLength = 0;
        for (let arr of arrays) {
            totalLength += arr.length;
        }
        let result = new resultConstructor(totalLength);
        let offset = 0;
        for (let arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    append(data) {
        this.buffer = this.concatenate(Uint8Array, this.buffer, data);

        if (this.buffer.length >= this.bufferSize) {
            this.flush(false);
        }

        const blockSize = data.length;
        this.bytesRead += blockSize;
    }

    flush(closing) {
        console.log("Flushing", this.buffer.length, this.pending);
        if (this.buffer.length > 0) {
            this.appendToFile(this.buffer, this.path, closing);
            this.buffer = new Uint8Array(0);
        } else {
            if (closing) {
                this.progress(Types.DOWNLOAD_FILE_DONE);
            }
        }
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

            console.log("Header", header, headerData.length);

            this.appendToFile(headerData, this.headersPath);

            return this.append(remaining);
        } else {
            return this.append(data);
        }
    }

    close() {
        this.flush(true);

        return this.appendChain;
    }

    fileSystemOp(resolve) {
        this.pending++;
        return (this.appendChain = this.appendChain.then(resolve).then(() => {
            this.pending--;
            if (this.pending == 0) {
                console.log("Done writing");
            }
        }));
    }

    onHeader(data) {
        console.log("onHeader", data);

        const reader = protobuf.Reader.create(data);
        const header = WireMessageReply.decodeDelimited(reader);

        this.readHeader = true;
        this.bytesTotal = header.fileData.size;

        console.log("Header", header, headerData.length);
    }

    onProgress(info) {
        this.bytesRead = info.received;
        this.bytesWritten = info.received;

        this.progress(Types.DOWNLOAD_FILE_PROGRESS);
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
                bytesWritten: this.bytesWritten,
                progress: this.bytesWritten / this.bytesTotal,
                started: this.started,
                elapsed: now - this.started
            }
        });
    }

    getWrite() {
        return this.path;
    }
}
