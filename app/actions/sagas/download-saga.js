'use strict'

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import * as Types from '../types';
import { deviceCall } from './saga-utils';

import { QueryType } from '../../lib/protocol';

function areTokensEqual(t1, t2) {
    if (t1 == null && t2 == null) {
        return true;
    }
    if (t1 == null || t2 == null || t1.byteLength != t2.byteLength) {
        return false;
    }
    const a1 = new Int8Array(t1);
    const a2 = new Int8Array(t2);
    for (let i = 0; i != t1.byteLength; i++) {
        if (a1[i] != a2[i]) return false;
    }
    return true;
}

export function* downloadDataSaga() {
    yield takeLatest(Types.DOWNLOAD_DATA_SET_START, function* watcher(action) {
        const state = yield select();

        const dataSetAction = yield call(deviceCall, {
            types: [Types.DEVICE_DATA_SET_START, Types.DEVICE_DATA_SET_SUCCESS, Types.DEVICE_DATA_SET_FAIL],
            address: state.deviceStatus.connected,
            message: {
                type: QueryType.values.QUERY_DATA_SET,
                queryDataSet: {
                    id: action.id
                }
            }
        });

        const totalSize = dataSetAction.response.dataSets.dataSets[0].size;

        let downloadedSize = 0;
        let token = null;

        while (true) {
            const { response } = yield call(deviceCall, {
                types: [Types.DEVICE_DOWNLOAD_DATA_SET_START, Types.DEVICE_DOWNLOAD_DATA_SET_SUCCESS, Types.DEVICE_DOWNLOAD_DATA_SET_FAIL],
                address: state.deviceStatus.connected,
                message: {
                    type: QueryType.values.QUERY_DOWNLOAD_DATA_SET,
                    downloadDataSet: {
                        id: action.id,
                        page: 0,
                        token: token
                    }
                }
            });

            const fileData = response.downloadDataSet || response.fileData;
            if (areTokensEqual(fileData.token, token)) {
                break;
            }

            downloadedSize += fileData.data.length;
            token = fileData.token;

            yield put({
                type: Types.DOWNLOAD_DATA_SET_PROGRESS,
                progress: (downloadedSize / totalSize) * 100.0
            });
        }

        yield put({
            type: Types.DOWNLOAD_DATA_SET_DONE
        });
    });
}
