'use strict'

import { put, call } from 'redux-saga/effects'
import { invokeDeviceApi } from '../middleware/device-api';

export function* deviceCall(raw) {
    yield put({
        type: raw.types[0],
        message: raw.message
    })
    try {
        const returned = yield call(invokeDeviceApi, raw);
        yield put(returned);
        return returned;
    }
    catch (err) {
        if (err.action) {
            yield put(err.action)
        }
        else {
            console.log("Error had no Action", err)
        }
        throw err;
    }
}

