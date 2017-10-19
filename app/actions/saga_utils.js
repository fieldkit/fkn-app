'use strict'

import { put, call } from 'redux-saga/effects'
import { invokeDeviceApi } from '../middleware/device-api';

export function* deviceCall(raw) {
    yield put({
        type: raw.types[0]
    })
    try {
        const returned = yield call(invokeDeviceApi, raw);
        yield put(returned);
        return returned;
    }
    catch (err) {
        yield put(err.action)
        throw err;
    }
}

