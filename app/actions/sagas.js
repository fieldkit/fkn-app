'use strict'

import Promise from "bluebird";
import { Alert } from 'react-native';
import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import Config from '../config';
import * as Types from './types';
import { deviceCall } from './saga-utils';

import { QueryType } from '../lib/protocol';
import { unixNow } from '../lib/helpers';

import { serviceDiscovery } from './discovery';
import { downloadDataSaga } from './download-saga';
import { liveDataSaga } from './live-data-saga';
import { navigateWelcome, navigateDeviceMenu } from './navigation';

export function* discoverDevices() {
    const devices = {};

    while (true) {
        const { discovered, to } = yield race({
            discovered: take(Types.FIND_DEVICE_INFO),
            to: delay(Config.findDeviceInterval)
        });

        if (discovered && discovered.address.valid) {
            const key = discovered.address.host;
            const entry = devices[key] || { time: 0 };
            const elapsed = (unixNow() - entry.time) * 1000;
            if (elapsed >= Config.deviceQueryInterval) {
                try
                {
                    yield call(deviceCall, {
                        types: [Types.DEVICE_HANDSHAKE_START, Types.DEVICE_HANDSHAKE_SUCCESS, Types.DEVICE_HANDSHAKE_FAIL],
                        address: discovered.address,
                        message: {
                            type: QueryType.values.QUERY_CAPABILITIES,
                            queryCapabilities: {
                                version: 1,
                                callerTime: unixNow()
                            }
                        }
                    });

                    devices[key] = {
                        address: discovered.address,
                        time: unixNow()
                    };

                    yield put({
                        type: Types.FIND_DEVICE_SUCCESS,
                        address: discovered.address
                    });
                }
                catch (e) {
                    yield put({
                        type: Types.FIND_DEVICE_LOST,
                        address: discovered.address
                    });
                }
            } else {
                console.log("discoverDevices:", key, "queried recently", elapsed);
            }
        }

        for (let key in devices) {
            const entry = devices[key];
            const elapsed = (unixNow() - entry.time) * 1000;
            if (elapsed >= Config.deviceExpireInterval) {
                console.log("discoverDevices: Lost", key, "after", elapsed, entry);
                yield put({
                    type: Types.FIND_DEVICE_LOST,
                    address: entry.address
                });
                delete devices[key];
            } else {
                console.log("discoverDevices: Kept", key, "after", elapsed);
            }
        }
    }
}

export function* queryActiveDeviceInformation() {
    yield takeLatest([Types.FIND_DEVICE_SELECT], function* (selected) {
        console.log('queryActiveDeviceInformation', selected);

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
        }
        catch (err) {
            yield put({
                type: Types.FIND_DEVICE_LOST,
                address: selected.address
            });
        }
    });
}

export function* pingConnectedDevice() {
    yield takeLatest([Types.FIND_DEVICE_SELECT, Types.DEVICE_PING_SUCCESS], function* (selected, ping) {
        console.log('pingConnectedDevice', selected);

        yield delay(Config.pingDeviceInterval);

        const { deviceStatus } = yield select();

        if (deviceStatus.connected && !deviceStatus.api.pending) {
            try {
                yield call(deviceCall, {
                    types: [Types.DEVICE_PING_START, Types.DEVICE_PING_SUCCESS, Types.DEVICE_PING_FAIL],
                    address: deviceStatus.connected,
                    message: {
                        type: QueryType.values.QUERY_CAPABILITIES,
                        queryCapabilities: {
                            version: 1,
                            callerTime: unixNow()
                        }
                    }
                });
            }
            catch (err) {
                yield put({
                    type: Types.FIND_DEVICE_LOST,
                    address: deviceStatus.connected
                });
            }
        }
    });
}

export function alert(message, title) {
    return new Promise((resolve) => {
        console.log("Showing alert", title);
        Alert.alert(
            title,
            message,
            [
                { text: 'OK', onPress: () => resolve() },
            ],
            { cancelable: false }
        )
    });
}

export function* deviceConnection() {
    yield takeLatest([Types.FIND_DEVICE_START], function* () {
        yield all([
            pingConnectedDevice(),
            queryActiveDeviceInformation()
        ])
    });
}

export function* navigateToDeviceMenuFromConnecting() {
    yield takeLatest([Types.NAVIGATION_CONNECTING], function* (nav) {
        const { device, to } = yield race({
            device: take(Types.FIND_DEVICE_SELECT),
            to: delay(Config.findDeviceTimeout)
        });

        if (device && device.type == Types.FIND_DEVICE_SELECT) {
            yield put(navigateDeviceMenu());
        }
        else {
            const { deviceStatus } = yield select();
            const numberOfDevices = Object.keys(deviceStatus.addresses).length;
            if (numberOfDevices == 0) {
                yield put(navigateWelcome());
            }
        }
    });
}

export function* navigateHomeOnConnectionLost() {
    yield takeLatest(Types.FIND_DEVICE_LOST, function* () {
        const { nav } = yield select();
        const route = nav.routes[nav.index];

        if (route.params && route.params.connectionRequired === true) {
            yield put(navigateWelcome());
            yield call(alert, "Device disconnected.", "Alert");
        }
    });
}

export function* connectionRelatedNavigation() {
    return yield all([
        navigateToDeviceMenuFromConnecting(),
        navigateHomeOnConnectionLost()
    ]);
}

export function* rootSaga() {
    yield all([
        serviceDiscovery(),
        discoverDevices(),
        deviceConnection(),
        connectionRelatedNavigation(),
        downloadDataSaga(),
        liveDataSaga(),
    ])
}
