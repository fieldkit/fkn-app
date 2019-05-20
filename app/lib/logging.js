import _ from "lodash";
import moment from "moment";
import Promise from "bluebird";
import RNFS from "react-native-fs";

import { resolveDataDirectoryPath } from "./downloading";

const logs = [];

function activePath() {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        return dataDirectoryPath + "/app-logs.txt";
    });
}

function rolloverPath() {
    return resolveDataDirectoryPath().then(dataDirectoryPath => {
        const stamp = moment(new Date()).format("YYYYMMDD_HHmmss");
        return dataDirectoryPath + "/app-logs." + stamp + ".txt";
    });
}

function rollover(fileInfo) {
    return activePath().then(activePath => {
        return rolloverPath()
            .then(rolloverPath => {
                console.log("Rolling Over", activePath, rolloverPath, fileInfo.size);
                return RNFS.moveFile(activePath, rolloverPath);
            })
            .then(() => {
                return resolveDataDirectoryPath();
            })
            .then(dataDirectoryPath => {
                return RNFS.readDir(dataDirectoryPath);
            })
            .then(dir => {
                return _(dir)
                    .filter(fe => {
                        const re = /^(.+)\.(\d+_\d+)\.txt$/;
                        const m = fe.name.match(re);
                        return m != null;
                    })
                    .sortBy(fe => fe.mtime)
                    .reverse()
                    .drop(10)
                    .reduce((promise, file) => {
                        return promise.then(values => {
                            return RNFS.unlink(file.path).then(value => {
                                return [...values, ...[file]];
                            });
                        });
                    }, Promise.resolve([]));
            })
            .then(deleted => {
                console.log("Deleted", deleted);
                return deleted;
            });
    });
}

function flush() {
    try {
        if (logs.length > 0) {
            return activePath().then(activePath => {
                const data = JSON.stringify(logs);

                logs.length = 0; // Empty logs.

                return RNFS.appendFile(activePath, data, "utf8")
                    .then(() => {
                        return RNFS.stat(activePath);
                    })
                    .then(fileInfo => {
                        if (fileInfo.size > 1 * 1024 * 1024) {
                            return rollover(fileInfo);
                        }
                        if (false && fileInfo.size > 10 * 1024) {
                            return rollover(fileInfo);
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
                        parts.push(arg);
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
