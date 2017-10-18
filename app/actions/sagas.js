'use strict'

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all } from 'redux-saga/effects'

import * as Types from './types';
import { CALL_DEVICE_API } from '../middleware/device-api';

import { QueryType } from '../lib/protocol';

export function* downloadDataSaga() {
    yield takeLatest(Types.DOWNLOAD_DATA_SET_START, function* watcher(action) {
        const state = yield select();

        yield put({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_DATA_SET_START, Types.DEVICE_DATA_SET_SUCCESS, Types.DEVICE_DATA_SET_FAIL],
                address: state.deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_DATA_SET,
                    queryDataSet: {
                        id: action.id
                    }
                }
            },
        });

        yield takeLatest(Types.DEVICE_DATA_SET_SUCCESS, function* watcher(dataSetAction) {
            const numberOfPages = dataSetAction.response.dataSets.dataSets[0].pages;

            for (let page = 0; page < numberOfPages; ++page) {
                yield put({
                    [CALL_DEVICE_API]: {
                        types: [Types.DEVICE_DOWNLOAD_DATA_SET_START, Types.DEVICE_DOWNLOAD_DATA_SET_SUCCESS, Types.DEVICE_DOWNLOAD_DATA_SET_FAIL],
                        address: state.deviceStatus.address,
                        message: {
                            type: QueryType.values.QUERY_DOWNLOAD_DATA_SET,
                            downloadDataSet: {
                                id: action.id,
                                page: page
                            }
                        }
                    },
                });

                yield put({
                    type: Types.DOWNLOAD_DATA_SET_PROGRESS,
                    progress: (page / numberOfPages) * 100.0
                });

                yield take(Types.DEVICE_DOWNLOAD_DATA_SET_SUCCESS);
            }

            yield put({
                type: Types.DOWNLOAD_DATA_SET_DONE
            });
        });
    });
}

export function* rootSaga() {
    yield all([
        downloadDataSaga(),
    ])
}
