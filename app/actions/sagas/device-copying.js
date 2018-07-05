import _ from 'lodash';

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import { QueryType } from '../../lib/protocol';
import { Toasts } from '../../lib/toasts';

import * as Types from '../types';

import { queryCapabilities } from '../device-status';
import { queryFiles, queryDownloadFile } from '../device-data';

import { deviceCall } from './saga-utils';

import Config from '../../config';

export function* deviceFilesCopier() {
    yield takeLatest(Types.COPY_DEVICE_FILES, function* watcher(action) {
        const fileIds = [1, 4];
        const devices = _(action.devices).filter(Config.deviceFilter).value();
        const numberOfFiles = _(devices).map(device => {
            // Right now we just download log and data file.
            return fileIds.length;
        }).sum();

        try {
            let filesDownloaded = 0;

            yield put({
                type: Types.TASK_START,
                task: {
                    cancelable: true,
                    done: false
                }
            });

            for (const key in devices) {
                const device = devices[key];

                console.log("Device", device);

                const filesAction = yield call(deviceCall, queryFiles(device.address));

                console.log("Files", filesAction);

                for (let i = 0; i < fileIds.length; ++i) {
                    const fileId = fileIds[i];
                    const file = _(filesAction.response.files.files).filter(f => f.id == fileId).first();

                    console.log("File", file);

                    const { download, stop } = yield race({
                        download: call(deviceCall, queryDownloadFile(device.capabilities, file, 0, 100000, device.address)),
                        stop: take(Types.OPERATION_CANCEL),
                    });

                    console.log(download, stop);

                    if (_.isObject(stop)) {
                        yield put({
                            type: Types.TASK_DONE,
                            task: {
                                done: true
                            }
                        });
                        return;
                    }

                    filesDownloaded++;

                    yield put({
                        type: Types.TASK_PROGRESS,
                        task: {
                            label: device.address.host,
                            progress: filesDownloaded / numberOfFiles,
                            cancelable: true,
                            done: false
                        }
                    });
                }
            }

            yield put({
                type: Types.TASK_DONE,
                task: {
                    done: true
                }
            });
        }
        catch (err) {
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

