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

/*
export function devicePing() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_PING_START, Types.DEVICE_PING_SUCCESS, Types.DEVICE_PING_FAIL],
                address: getState().deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                    queryCapabilities: {
                        version: 1,
                        callerTime: unixNow()
                    }
                }
            },
        });
    };
}

export function queryDeviceCapabilities() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
                address: getState().deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                    queryCapabilities: {
                        version: 1,
                        callerTime: unixNow()
                    }
                }
            },
        });
    };
}
*/

export function* discoverDevice() {
    const { deviceStatus, to } = yield race({
        deviceStatus: take(Types.FIND_DEVICE_INFO),
        to: delay(Config.findDeviceTimeout)
    });

    if (deviceStatus && deviceStatus.address.valid) {
        while (true) {
            try
            {
                yield call(deviceCall, {
                    types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
                    address: deviceStatus.address,
                    message: {
                        type: QueryType.values.QUERY_CAPABILITIES,
                        queryCapabilities: {
                            version: 1,
                            callerTime: unixNow()
                        }
                    }
                });

                yield put({
                    type: Types.FIND_DEVICE_SUCCESS,
                });

                break;
            }
            catch (e) {
                yield delay(5000);
            }
        }
    }
    else {
        yield put({
            type: Types.FIND_DEVICE_FAIL,
        });
    }
}

export function* pingDevice() {
    yield takeLatest([Types.FIND_DEVICE_SUCCESS, Types.DEVICE_PING_SUCCESS], function* () {
        yield delay(Config.pingDeviceInterval);

        const { deviceStatus } = yield select();

        if (!deviceStatus.api.pending) {
            try {
                yield call(deviceCall, {
                    types: [Types.DEVICE_PING_START, Types.DEVICE_PING_SUCCESS, Types.DEVICE_PING_FAIL],
                    address: deviceStatus.address,
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
                // console.log('Ping failed', err);
                yield put({
                    type: Types.FIND_DEVICE_LOST
                });
            }
        }
    });
}

export function alert(message, title) {
    return new Promise((resolve) => {
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
    yield takeLatest([Types.FIND_DEVICE_START, Types.FIND_DEVICE_LOST], function* () {
        yield all([
            discoverDevice(),
            pingDevice()
        ])
    });
}

export function* navigateToDeviceMenuFromConnecting() {
    yield takeLatest([Types.NAVIGATION_CONNECTING], function* (nav) {
        const { deviceStatus } = yield select();

        if (deviceStatus.connected) {
            yield put(navigateDeviceMenu());
        }
        else {
            const returned = yield take([
                Types.FIND_DEVICE_SUCCESS,
                Types.FIND_DEVICE_FAIL
            ]);

            if (returned.type == Types.FIND_DEVICE_SUCCESS) {
                yield put(navigateDeviceMenu());
            }
            else {
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
        deviceConnection(),
        connectionRelatedNavigation(),
        downloadDataSaga(),
        liveDataSaga(),
    ])
}
