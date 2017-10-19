'use strict'

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import * as Types from './types';
import { CALL_DEVICE_API, invokeDeviceApi } from '../middleware/device-api';

import { QueryType } from '../lib/protocol';

import { serviceDiscovery } from './discovery';

import { unixNow } from '../lib/helpers';

import { navigateWelcome, navigateDeviceMenu } from './navigation';

import Config from '../config';

function* deviceCall(raw) {
    yield put({
        type: raw.types[0]
    })
    try {
        const returned = yield call(invokeDeviceApi, raw);
        yield put(returned);
        return returned;
    }
    catch (err) {
        yield put(err.action)
        throw err;
    }
}

export function* downloadDataSaga() {
    yield takeLatest(Types.DOWNLOAD_DATA_SET_START, function* watcher(action) {
        const state = yield select();

        const dataSetAction = yield call(deviceCall, {
            types: [Types.DEVICE_DATA_SET_START, Types.DEVICE_DATA_SET_SUCCESS, Types.DEVICE_DATA_SET_FAIL],
            address: state.deviceStatus.address,
            message: {
                type: QueryType.values.QUERY_DATA_SET,
                queryDataSet: {
                    id: action.id
                }
            }
        });

        const numberOfPages = dataSetAction.response.dataSets.dataSets[0].pages;

        for (let page = 0; page < numberOfPages; ++page) {
            yield call(deviceCall, {
                types: [Types.DEVICE_DOWNLOAD_DATA_SET_START, Types.DEVICE_DOWNLOAD_DATA_SET_SUCCESS, Types.DEVICE_DOWNLOAD_DATA_SET_FAIL],
                address: state.deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_DOWNLOAD_DATA_SET,
                    downloadDataSet: {
                        id: action.id,
                        page: page
                    }
                }
            });

            yield put({
                type: Types.DOWNLOAD_DATA_SET_PROGRESS,
                progress: (page / numberOfPages) * 100.0
            });
        }

        yield put({
            type: Types.DOWNLOAD_DATA_SET_DONE
        });
    });
}

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
    ])
}
