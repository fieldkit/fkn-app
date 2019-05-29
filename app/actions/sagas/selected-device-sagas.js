import _ from "lodash";
import Promise from "bluebird";
import { Alert } from "react-native";

import { put, take, takeLatest, takeEvery, select, all, race, call, delay } from "redux-saga/effects";

import { QueryType } from "../../lib/protocol";
import { unixNow } from "../../lib/helpers";
import Config from "../../config";

import * as Types from "./../types";
import { navigateWelcome, navigateDeviceMenu } from "../navigation";

import { deviceCall } from "./saga-utils";

import { liveDataSaga } from "./live-data-saga";

export function* queryActiveDeviceInformation() {
    yield takeLatest([Types.FIND_DEVICE_SELECT], function*(selected) {
        console.log("queryActiveDeviceInformation", selected);

        try {
            yield put(navigateDeviceMenu());

            yield call(deviceCall, {
                types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
                address: selected.address,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                    queryCapabilities: {
                        version: 1,
                        callerTime: unixNow()
                    }
                }
            });
        } catch (err) {
            console.log("Error", err);
            if (false) {
                yield put({
                    type: Types.FIND_DEVICE_LOST,
                    address: selected.address,
                    error: err
                });
            }
        }
    });
}

export function* pingConnectedDevice() {
    yield takeLatest([Types.FIND_DEVICE_SELECT], function*(selected) {
        console.log("pingConnectedDevice", selected);

        while (true) {
            const started = unixNow();

            console.log("Tick", started);

            yield delay(1000);

            console.log("Tock", unixNow(), unixNow() - started);

            const { selectedDevice, devices } = yield select();

            if (!_.isObject(selectedDevice.connected)) {
                console.log("Not connected.");
                return;
            }

            const device = devices[selectedDevice.connected.key];

            if (!_.isObject(device)) {
                console.log("No device");
                return;
            }

            const elapsed = (unixNow() - device.time) * 1000;

            console.log(elapsed, Config.pingDeviceInterval);

            if (elapsed > Config.pingDeviceInterval) {
                try {
                    yield call(deviceCall, {
                        types: [Types.DEVICE_PING_START, Types.DEVICE_PING_SUCCESS, Types.DEVICE_PING_FAIL],
                        address: selectedDevice.connected,
                        message: {
                            type: QueryType.values.QUERY_STATUS,
                            queryCapabilities: {
                                version: 1,
                                callerTime: unixNow()
                            }
                        }
                    });
                } catch (err) {
                    console.log("Error", err);
                }
            } else {
                console.log("Skipped ping");
            }
        }
    });
}

export function* selectedDeviceSagas() {
    yield takeLatest([Types.FIND_DEVICE_START], function*() {
        try {
            yield all([pingConnectedDevice(), queryActiveDeviceInformation(), liveDataSaga()]);
        } catch (err) {
            console.log("Error", err);
        }
    });
}
