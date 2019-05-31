import _ from "lodash";
import moment from "moment";
import Promise from "bluebird";
import protobuf from "protobufjs";

import RNFS from "react-native-fs";

import { DataRecord } from "./protocol";

import { hexArrayBuffer, arrayBufferToBase64 } from "./base64";

import { getDirectory, resolveDataDirectoryPath } from "./downloading";

const logs = [];

function activePath() {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        return dataDirectoryPath + "/app-logs.fkpb";
    });
}

function rolloverPath() {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        const stamp = moment(new Date()).format("YYYYMMDD_HHmmss");
        return dataDirectoryPath + "/app-logs." + stamp + ".fkpb";
    });
}

export function getArchivedLogs() {
    return getDirectory("/").then(dir => {
        return _(dir.listing)
            .filter(fe => {
                const re = /^(app-logs)\.(\d+_\d+)\.fkpb$/;
                const m = fe.name.match(re);
                return m != null;
            })
            .sortBy(fe => fe.mtime)
            .reverse()
            .value();
    });
}

function deleteFiles(files) {
    return _(files).reduce((promise, file) => {
        return promise.then(values => {
            console.log("Deleting", file.path);
            return RNFS.unlink(file.path).then(value => {
                return [...values, ...[file]];
            });
        });
    }, Promise.resolve([]));
}

export function deleteArchivedLogs() {
    return getArchivedLogs().then(files => deleteFiles(files));
}

export function rollover(deleteOld) {
    return activePath().then(activePath => {
        return rolloverPath()
            .then(rolloverPath => {
                console.log("Rolling Over", activePath, rolloverPath);
                return RNFS.moveFile(activePath, rolloverPath);
            })
            .then(() => {
                return getArchivedLogs();
            })
            .then(files => {
                if (deleteOld === false) {
                    return [];
                }
                return deleteFiles(
                    _(files)
                        .drop(10)
                        .value()
                );
            });
    });
}

function flush() {
    try {
        if (logs.length > 0) {
            return activePath().then(activePath => {
                const buffer = protobuf.Writer.create();
                const encoded = _(logs)
                    .map(log => {
                        return {
                            log: {
                                time: 0,
                                uptime: 0,
                                level: 0,
                                facility: "App",
                                message: JSON.stringify(log)
                            }
                        };
                    })
                    .map(row => {
                        return DataRecord.encodeDelimited(row, buffer).finish();
                    })
                    .value();

                logs.length = 0; // Empty logs.

                return RNFS.appendFile(activePath, arrayBufferToBase64(buffer.finish()), "base64")
                    .then(() => {
                        return RNFS.stat(activePath);
                    })
                    .then(fileInfo => {
                        if (fileInfo.size > 1 * 1024 * 1024) {
                            return rollover(true);
                        }
                        return Promise.resolve();
                    });
            });
        }
    } catch (error) {
        console.log("Error saving logs", error);
    }
    return Promise.resolve();
}

function isState(obj) {
    return _.isObject(obj) && obj.__state__ === true;
}

function isAction(obj) {
    return _.isObject(obj) && _.isString(obj.type);
}

export function initializeLogging() {
    // NOTE: http://tobyho.com/2012/07/27/taking-over-console-log/
    if (__ENV__ === "test") {
        return;
    }
    const console = window.console;
    if (!console) {
        return;
    }

    function wrap(method) {
        const original = console[method];
        console[method] = function() {
            const args = Array.prototype.slice.apply(arguments);
            const parts = [];
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (false) {
                    if (!arg || typeof arg === "string" || typeof arg === "number") {
                        parts.push(arg);
                    } else {
                        parts.push(arg);
                    }
                } else {
                    if (isState(arg)) {
                        parts.push({ __state__: true });
                    } else {
                        if (typeof arg === "string") {
                            parts.push(arg.trim());
                        } else {
                            parts.push(arg);
                        }
                    }
                }
            }
            logs.push(parts);
            if (original.apply) {
                original.apply(console, arguments);
            } else {
                original(Array.prototype.slice.apply(arguments).join(" ")); // IE
            }
        };
    }

    const methods = ["log", "warn", "error"];
    for (let i = 0; i < methods.length; i++) {
        wrap(methods[i]);
    }

    setInterval(() => {
        flush();
    }, 1000);

    ErrorUtils.setGlobalHandler((error, isFatal) => {
        flush();
    });
}
