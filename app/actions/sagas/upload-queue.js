import _ from 'lodash';

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import { QueryType } from '../../lib/protocol';
import { Toasts } from '../../lib/toasts';
import { uploadFile } from '../../lib/uploading';

import * as Types from '../types';

import { queryCapabilities } from '../device-status';
import { queryFiles, queryDownloadFile } from '../device-data';

import { deviceCall } from './saga-utils';

export function* uploadQueue() {
    yield takeLatest(Types.UPLOAD_QUEUE, function* watcher(action) {
        try {
            yield put({
                type: Types.TASK_START,
                task: {
                    cancelable: true,
                    done: false
                }
            });

            const queue = action.queue;
            const numberOfFiles = _.size(queue);
            let filesUploaded = 0;

            for (let i = 0; i < queue.length; ++i) {
                const file = queue[i];

                yield put({
                    type: Types.TASK_PROGRESS,
                    task: {
                        label: file.name,
                        progress: filesUploaded / numberOfFiles,
                        cancelable: true,
                        done: false
                    }
                });

                const { upload, stop } = yield race({
                    upload: call(uploadFile, file.relativePath),
                    stop: take(Types.OPERATION_CANCEL),
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

                filesUploaded++;
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
