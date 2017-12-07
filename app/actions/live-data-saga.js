'use strict'

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import * as Types from './types';
import { deviceCall } from './saga-utils';

import { QueryType } from '../lib/protocol';

export function* deviceLiveDataPoll(interval) {
    const state = yield select();
    yield call(deviceCall, {
        types: [Types.DEVICE_LIVE_DATA_POLL_START, Types.DEVICE_LIVE_DATA_POLL_SUCCESS, Types.DEVICE_LIVE_DATA_POLL_FAIL],
        address: state.deviceStatus.address,
        message: {
            type: QueryType.values.QUERY_LIVE_DATA_POLL,
            liveDataPoll: {
                interval: interval
            }
        }
    });
}

export function* liveDataSaga() {
    yield takeLatest(Types.LIVE_DATA_POLL_START, function* watcher(action) {
        while (true) {
            try {
                yield deviceLiveDataPoll(1000);
            }
            catch (err) {
                console.log(err);
            }

            const { stop } = yield race({
                stop: take(Types.LIVE_DATA_POLL_STOP),
                delay: delay(1000),
            });

            if (stop) {
                break;
            }
        }

        try {
            yield deviceLiveDataPoll(0);
        }
        catch (err) {
            console.log(err);
        }
    });
}
