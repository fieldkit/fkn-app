import Promise from "bluebird";
import { Alert } from "react-native";
import { delay } from "redux-saga";
import { put, take, takeLatest, takeEvery, select, all, race, call, fork } from "redux-saga/effects";

import { QueryType } from "../../lib/protocol";
import { unixNow } from "../../lib/helpers";
import Config from "../../config";

import * as Types from "./../types";
import { navigateWelcome, navigateDeviceMenu } from "../navigation";
import { timerTick, timerDone } from "../timers";

import { deviceCall } from "./saga-utils";

export function* loseExpiredDevices() {
    const { devices } = yield select();

    for (let key in devices) {
        const entry = devices[key];
        const elapsed = (unixNow() - entry.time) * 1000;
        if (elapsed >= Config.deviceExpireInterval) {
            console.log("discoverDevices: Lost", key, "after", elapsed, entry);
            yield put({
                type: Types.FIND_DEVICE_LOST,
                address: entry.address
            });
        }
    }
}

export function* deviceStatus(device) {
    try {
        console.log("Handshake (Status)", device);

        const filesReply = yield call(deviceCall, {
            types: [Types.DEVICE_FILES_START, Types.DEVICE_FILES_SUCCESS, Types.DEVICE_FILES_FAIL],
            address: device.address,
            blocking: false,
            message: {
                type: QueryType.values.QUERY_FILES
            }
        });

        /*
        yield put({
            type: Types.FIND_DEVICE_SUCCESS,
            address: device.address
        });
        */
    } catch (err) {
        console.log("Handshake Error:", err.message);
    }
}

export function* deviceHandshake(device) {
    try {
        console.log("Handshake", device);

        const handshakeReply = yield call(deviceCall, {
            types: [Types.DEVICE_HANDSHAKE_START, Types.DEVICE_HANDSHAKE_SUCCESS, Types.DEVICE_HANDSHAKE_FAIL],
            address: device.address,
            message: {
                type: QueryType.values.QUERY_CAPABILITIES,
                queryCapabilities: {
                    version: 1,
                    callerTime: unixNow()
                }
            }
        });

        const capabilities = handshakeReply.response.capabilities;

        yield put({
            type: Types.FIND_DEVICE_SUCCESS,
            address: device.address,
            capabilities: capabilities
        });

        if (Config.discoveryQueryFilesAndStatus) {
            const identityReply = yield call(deviceCall, {
                types: [Types.DEVICE_QUERY_IDENTITY_START, Types.DEVICE_QUERY_IDENTITY_SUCCESS, Types.DEVICE_QUERY_IDENTITY_FAIL],
                address: device.address,
                message: {
                    type: QueryType.values.QUERY_IDENTITY
                }
            });

            const filesReply = yield call(deviceCall, {
                types: [Types.DEVICE_FILES_START, Types.DEVICE_FILES_SUCCESS, Types.DEVICE_FILES_FAIL],
                address: device.address,
                blocking: false,
                message: {
                    type: QueryType.values.QUERY_FILES
                }
            });

            const statusReply = yield call(deviceCall, {
                types: [Types.DEVICE_STATUS_START, Types.DEVICE_STATUS_SUCCESS, Types.DEVICE_STATUS_FAIL],
                address: device.address,
                message: {
                    type: QueryType.values.QUERY_STATUS,
                    queryCapabilities: {
                        version: 1,
                        callerTime: unixNow()
                    }
                }
            });
        }
    } catch (err) {
        console.log("Handshake Error:", err.message);
    }
}

export function* discoverDevices() {
    const started = unixNow();
    const lastChecked = {};

    while (true) {
        const { discovered, to } = yield race({
            discovered: take(Types.FIND_DEVICE_INFO),
            to: delay(Config.findDeviceInterval)
        });

        if (discovered && discovered.address.valid) {
            const key = discovered.address.key;
            const entry = lastChecked[key] || {
                time: 0,
                handshake: 0
            };
            const elapsedSinceCheck = (unixNow() - entry.time) * 1000;
            const elapsedSinceHandshake = (unixNow() - entry.handshake) * 1000;
            if (elapsedSinceHandshake >= Config.deviceHandshakeInterval) {
                lastChecked[key] = { ...entry, ...{ handshake: unixNow(), time: unixNow() } };
                yield fork(deviceHandshake, discovered);
            } else if (elapsedSinceCheck >= Config.deviceQueryInterval) {
                lastChecked[key] = { ...entry, ...{ time: unixNow() } };
                yield fork(deviceStatus, discovered);
            }
        }

        if (unixNow() - started > 10) {
            yield loseExpiredDevices();
        }
    }
}
