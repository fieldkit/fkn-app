import Promise from "bluebird";
import { Alert } from 'react-native';
import { delay } from 'redux-saga';
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects';

import { QueryType } from '../../lib/protocol';
import { unixNow } from '../../lib/helpers';
import Config from '../../config';

import * as Types from './../types';
import { navigateWelcome, navigateDeviceMenu } from '../navigation';
import { timerTick, timerDone } from '../timers';

import { deviceCall } from './saga-utils';

import { serviceDiscovery } from './discovery';
import { downloadDataSaga } from './download-saga';
import { liveDataSaga } from './live-data-saga';

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
            delete devices[key];
        }
    }
}

export function* deviceHandshake(device) {
    try
    {
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
    }
    catch (e) {
        yield put({
            type: Types.FIND_DEVICE_LOST,
            address: device.address
        });
    }
}

export function* discoverDevices() {
    while (true) {
        const { discovered, to } = yield race({
            discovered: take(Types.FIND_DEVICE_INFO),
            to: delay(Config.findDeviceInterval)
        });

        const { devices } = yield select();

        if (discovered && discovered.address.valid) {
            const key = discovered.address.key;
            const entry = devices[key] || { time: 0 };
            const elapsed = (unixNow() - entry.time) * 1000;
            if (elapsed >= Config.deviceQueryInterval) {
                yield deviceHandshake(discovered);
            } else {
                // console.log("discoverDevices:", key, "queried recently", elapsed);
            }
        }

        yield loseExpiredDevices();
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
            console.log("Error", err);
            yield put({
                type: Types.FIND_DEVICE_LOST,
                address: selected.address,
                error: err
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
                        type: QueryType.values.QUERY_STATUS,
                        queryCapabilities: {
                            version: 1,
                            callerTime: unixNow()
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error", err);
                yield put({
                    type: Types.FIND_DEVICE_LOST,
                    address: deviceStatus.connected,
                    error: err
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
        );
    });
}

export function* deviceConnection() {
    yield takeLatest([Types.FIND_DEVICE_START], function* () {
        yield all([
            pingConnectedDevice(),
            queryActiveDeviceInformation()
        ]);
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
            const { devices } = yield select();
            const numberOfDevices = Object.keys(devices).length;
            if (numberOfDevices == 0) {
                yield put(navigateWelcome());
            }
        }
    });
}

export function* navigateHomeOnConnectionLost() {
    yield takeLatest(Types.FIND_DEVICE_LOST, function* (lostDevice) {
        const { deviceStatus, nav } = yield select();
        const route = nav.routes[nav.index];

        if (deviceStatus.connected && deviceStatus.connected.key === lostDevice.address.key) {
            if (route.params && route.params.connectionRequired === true) {
                yield put(navigateWelcome());
                yield call(alert, "Device disconnected.", "Alert");
            }
        }
    });
}

export function* connectionRelatedNavigation() {
    return yield all([
        navigateToDeviceMenuFromConnecting(),
        navigateHomeOnConnectionLost()
    ]);
}

export function* timersSaga() {
    yield takeEvery(Types.TIMER_START, function* (start) {
        const started = unixNow();
        while (true) {
            const elapsed = unixNow() - started;
            if (elapsed >= start.seconds) {
                yield put(timerDone(start.name, start.seconds));
                break;
            }
            yield put(timerTick(start.name, start.seconds, start.seconds - elapsed));
            const { cancel, to } = yield race({
                cancel: take(Types.TIMER_CANCEL),
                to: delay(800)
            });
            if (cancel && cancel.name === start.name) {
                break;
            }
        }
    });
}

export function* queryFilesOnFoundDevices() {
    yield takeEvery([Types.FIND_DEVICE_SUCCESS], function* (device) {
        yield call(deviceCall, {
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

        yield call(deviceCall, {
            types: [Types.DEVICE_FILES_START, Types.DEVICE_FILES_SUCCESS, Types.DEVICE_FILES_FAIL],
            address: device.address,
            blocking: false,
            message: {
                type: QueryType.values.QUERY_FILES
            }
        });
    });
}

export function* rootSaga() {
    yield all([
        serviceDiscovery(),
        discoverDevices(),
        deviceConnection(),
        connectionRelatedNavigation(),
        downloadDataSaga(),
        liveDataSaga(),
        timersSaga(),
        queryFilesOnFoundDevices(),
    ]);
}
