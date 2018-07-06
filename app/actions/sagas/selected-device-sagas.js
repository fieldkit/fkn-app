import Promise from "bluebird";
import { Alert } from 'react-native';
import { delay } from 'redux-saga';
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects';

import { QueryType } from '../../lib/protocol';
import { unixNow } from '../../lib/helpers';
import Config from '../../config';

import * as Types from './../types';
import { navigateWelcome, navigateDeviceMenu } from '../navigation';

import { deviceCall } from './saga-utils';

import { liveDataSaga } from './live-data-saga';

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

export function* selectedDeviceSagas() {
    yield takeLatest([Types.FIND_DEVICE_START], function* () {
        yield all([
            pingConnectedDevice(),
            queryActiveDeviceInformation(),
            liveDataSaga()
        ]);
    });
}
