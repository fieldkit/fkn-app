import _ from "lodash";

import { put, take, takeLatest, takeEvery, select, all, race, call, delay } from "redux-saga/effects";

import { QueryType } from "../../lib/protocol";
import { Toasts } from "../../lib/toasts";

import * as Types from "../types";

import { queryCapabilities } from "../device-status";
import { queryFiles, queryDeviceMetadata, queryDownloadFile, deleteFile } from "../device-data";
import { deleteLocalFile, renameLocalDirectory, archiveLocalFile, touchLocalFile } from "../local-files";

import { uploadFile } from "../../lib/uploading";
import { writeDeviceMetadata } from "../../lib/downloading";

import { Dispatcher, deviceCall } from "./saga-utils";

class Devices {
    constructor() {
        this.cache = {};
    }

    *getInformation(address) {
        if (!_.isObject(this.cache[address.key])) {
            const capabilitiesAction = yield call(deviceCall, queryCapabilities(address));
            const metadataAction = yield call(deviceCall, queryDeviceMetadata(address));

            this.cache[address.key] = {
                address: address,
                capabilities: capabilitiesAction.response.capabilities,
                metadata: metadataAction.response.fileData.data
            };
        }
        return this.cache[address.key];
    }

    *refresh() {
        console.log("Refreshing devices");
        const queries = _(this.cache)
            .values()
            .map(row => {
                console.log("Refreshing", row.address);
                return call(deviceCall, queryFiles(row.address));
            })
            .value();

        return yield all(queries);
    }
}

export function* executePlans() {
    yield takeLatest(Types.PLAN_EXECUTE, function* watcher(action) {
        try {
            const devices = new Devices();

            yield put({
                type: Types.TASK_START,
                task: {
                    cancelable: true,
                    done: false
                }
            });

            const { plan } = action;
            const totalSteps = plan.length;
            let stepsCompleted = 0;

            for (const step of plan) {
                yield put({
                    type: Types.TASK_PROGRESS,
                    task: {
                        label: "",
                        progress: stepsCompleted / totalSteps,
                        cancelable: true,
                        done: false
                    }
                });

                const key = _.first(Object.keys(step));
                const details = step[key];

                console.log("Step", key, step, details);

                switch (key) {
                    case "download": {
                        const info = yield devices.getInformation(details.address);

                        yield call(writeDeviceMetadata, info.capabilities, info.metadata);

                        console.log(info);
                        const file = {
                            id: details.id,
                            size: details.length,
                            version: details.version
                        };
                        const settings = {
                            offset: details.offset,
                            length: details.length,
                            paths: {
                                file: details.file,
                                headers: details.headers
                            }
                        };

                        const { downloaded, stop } = yield race({
                            downloaded: call(deviceCall, queryDownloadFile(info.capabilities, file, settings, details.address)),
                            stop: take(Types.OPERATION_CANCEL)
                        });

                        if (_.isObject(stop)) {
                            yield put({
                                type: Types.TASK_DONE,
                                task: {
                                    done: true
                                }
                            });
                            return;
                        }

                        break;
                    }
                    case "rename": {
                        yield call(renameLocalDirectory(details.from, details.to));

                        break;
                    }
                    case "delete": {
                        if (details.path) {
                            yield call(deleteLocalFile(details.path));
                        } else {
                            yield call(deviceCall, deleteFile(details.id, details.address));
                        }

                        break;
                    }
                    case "archive": {
                        yield call(archiveLocalFile(details.file));

                        if (_.isString(details.touch)) {
                            yield call(touchLocalFile(details.touch));
                        }

                        break;
                    }
                    case "backup": {
                        yield call(archiveLocalFile(details.file));

                        break;
                    }
                    case "upload": {
                        const dispatcher = new Dispatcher();
                        const started = new Date();

                        function progress(action) {
                            dispatcher.dispatch(action);
                        }

                        const { upload, stop } = yield race({
                            upload: call(uploadFile, details.file, details.headers, progress),
                            stop: take(Types.OPERATION_CANCEL),
                            actions: dispatcher.pump()
                        });

                        if (_.isObject(stop)) {
                            yield put({
                                type: Types.TASK_DONE,
                                task: {
                                    done: true
                                }
                            });
                            return;
                        } else {
                        }

                        break;
                    }
                }

                stepsCompleted++;
            }

            yield devices.refresh();

            yield put({
                type: Types.TASK_DONE,
                task: {
                    done: true
                }
            });
        } catch (err) {
            console.log("Error", err);
            yield put({
                type: Types.DEVICE_CONNECTION_ERROR
            });
            yield put({
                type: Types.TASK_DONE,
                task: {
                    done: true
                }
            });
        }
    });
}
