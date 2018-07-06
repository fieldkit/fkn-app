import Promise from "bluebird";
import { Alert } from 'react-native';
import { delay } from 'redux-saga';
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects';

import Config from '../../config';

import * as Types from './../types';
import { navigateWelcome, navigateDeviceMenu } from '../navigation';

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

