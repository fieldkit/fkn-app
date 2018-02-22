'use strict';

import _ from 'lodash';
import { put, call, select } from 'redux-saga/effects';
import { CALL_DEVICE_API, invokeDeviceApi } from '../middleware/device-api';

export function* deviceCall(raw) {
    if (_.isFunction(raw)) {
        const state = yield select();
        const actions = [];
        raw(action => actions.push(action), () => state);
        if (actions.length != 1) {
            console.log("Error: Not sure how to handle two actions from dispatch!");
            return null;
        }
        const deviceRaw = actions[0][CALL_DEVICE_API];
        return yield call(deviceCall, deviceRaw);
    }

    if (!_.isObject(raw.address)) {
        throw new Error("Bad address given to deviceCall");
    }

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
            console.log("Error had no Action", err);
        }
        throw err;
    }
}

