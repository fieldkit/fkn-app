'use strict'

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import * as Types from './types';
import { deviceCall } from './saga-utils';

import { QueryType } from '../lib/protocol';

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

        const numberOfPages = dataSetAction.response.dataSets.dataSets[0].pages;

        for (let page = 0; page < numberOfPages; ++page) {
            yield call(deviceCall, {
                types: [Types.DEVICE_DOWNLOAD_DATA_SET_START, Types.DEVICE_DOWNLOAD_DATA_SET_SUCCESS, Types.DEVICE_DOWNLOAD_DATA_SET_FAIL],
                address: state.deviceStatus.connected,
                message: {
                    type: QueryType.values.QUERY_DOWNLOAD_DATA_SET,
                    downloadDataSet: {
                        id: action.id,
                        page: page
                    }
                }
            });

            yield put({
                type: Types.DOWNLOAD_DATA_SET_PROGRESS,
                progress: (page / numberOfPages) * 100.0
            });
        }

        yield put({
            type: Types.DOWNLOAD_DATA_SET_DONE
        });
    });
}
