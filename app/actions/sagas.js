'use strict'

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import Config from '../config';
import * as Types from './types';
import { deviceCall } from './saga-utils';

import { QueryType } from '../lib/protocol';

import { serviceDiscovery } from './discovery';
import { downloadDataSaga } from './download-saga';
import { liveDataSaga } from './live-data-saga';
import { navigateWelcome, navigateDeviceMenu } from './navigation';

export function* discoverDevice() {
    const { deviceStatus, to } = yield race({
        deviceStatus: take(Types.FIND_DEVICE_INFO),
        to: delay(Config.findDeviceTimeout)
    });

    if (deviceStatus && deviceStatus.address.valid) {
        yield call(deviceCall, {
            types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
            address: deviceStatus.address,
            message: {
                type: QueryType.values.QUERY_CAPABILITIES,
                queryCapabilities: {
                    version: 1
                }
            }
        });

        yield put({
            type: Types.FIND_DEVICE_SUCCESS,
        });
    }
    else {
        yield put({
            type: Types.FIND_DEVICE_FAIL,
        });
    }
}

export function* pingDevice() {
    yield takeLatest([Types.FIND_DEVICE_SUCCESS, Types.DEVICE_PING_SUCCESS], function* (a) {
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
                            version: 1
                        }
                    }
                });
            }
            catch (err) {
                // Try again.
                console.log(err);
            }
        }
    });
}

export function* deviceConnection() {
    yield takeLatest(Types.FIND_DEVICE_START, function* () {
        yield all([
            discoverDevice(),
            pingDevice(),
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
