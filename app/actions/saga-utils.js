'use strict'

import { put, call } from 'redux-saga/effects'
import { invokeDeviceApi } from '../middleware/device-api';

export function* deviceCall(raw) {
    yield put({
        type: raw.types[0],
        deviceApi: {
            pending: true,
            blocking: raw.blocking,
        },
        address: raw.address,
        message: raw.message
    });
    try {
        const returned = yield call(invokeDeviceApi, raw);
        yield put(returned);
        return returned;
    }
    catch (err) {
        if (err.actions) {
            for (let action of err.actions) {
                yield put(action);
            }
        }
        else {
            console.log("Error had no Action", err)
        }
        throw err;
    }
}

