import _ from "lodash";
import { put, call, select, race, all } from "redux-saga/effects";

import { createChannel } from "./channels";

import { CALL_DEVICE_API, invokeDeviceApi } from "../../middleware/device-api";

import * as ActionTypes from "../types.js";

export class Dispatcher {
    constructor() {
        this.channel = createChannel("Dispatcher");
    }

    dispatch(action) {
        this.channel.put(action);
    }

    disapatcher() {
        return action => {
            this.dispatch(action);
        };
    }

    *pump() {
        while (this.channel.isOpen()) {
            const action = yield call(this.channel.take);
            yield put(action);
        }
    }
}

function* readAndPutActions(channel) {
    while (channel.isOpen()) {
        const action = yield call(channel.take);
        yield put(action);
    }
}

export function* deviceCall(raw, existingChannel) {
    if (_.isUndefined(raw)) {
        throw new Error("Invalid device query.");
    }

    const getDeviceApiCall = actions => {
        if (actions.length == 0) {
            throw new Error("Error: No actions returned from dispatch.", raw);
        } else if (actions.length > 1) {
            throw new Error(
                "Error: Not sure how to handle two actions from dispatch.",
                raw,
                actions
            );
        }
        const call = actions[0][CALL_DEVICE_API];
        if (_.isUndefined(call)) {
            throw new Error(
                "Action callback returned invalid CALL_DEVICE_API",
                raw
            );
        }
        return call;
    };

    const channel = existingChannel || createChannel("CALL");

    if (_.isFunction(raw)) {
        const state = yield select();
        const actions = [];

        const dispatch = action => {
            if (_.isObject(action[CALL_DEVICE_API])) {
                actions.push(action);
            } else {
                channel.put(action);
            }
        };

        yield Promise.resolve(raw(dispatch, () => state));

        return yield call(deviceCall, getDeviceApiCall(actions), channel);
    } else if (_.isObject(raw[CALL_DEVICE_API])) {
        raw = raw[CALL_DEVICE_API];
    }

    if (raw.address === null || typeof raw.address !== "object") {
        const state = yield select();
        raw.address = state.deviceStatus.connected;
        if (raw.address === null || typeof raw.address !== "object") {
            yield put({
                type: ActionTypes.DEVICE_CONNECTION_ERROR
            });
            throw new Error("No device connection");
        }
    }

    yield put({
        type: raw.types[0],
        deviceApi: {
            pending: true,
            blocking: raw.blocking
        },
        message: raw.message
    });

    try {
        const { returned } = yield race({
            returned: call(invokeDeviceApi, raw),
            actions: readAndPutActions(channel)
        });

        yield put(returned);

        return returned;
    } catch (err) {
        if (err.actions) {
            for (let action of err.actions) {
                yield put(action);
            }
        } else {
            console.log("Error had no Action", err);
        }
        throw err;
    } finally {
        channel.close();
    }
}
