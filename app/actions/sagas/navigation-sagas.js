import Promise from "bluebird";
import { Alert } from "react-native";
import { delay } from "redux-saga";
import { put, take, takeLatest, takeEvery, select, all, race, call } from "redux-saga/effects";

import Config from "../../config";

import * as Types from "./../types";
import { navigateWelcome, navigateDeviceMenu } from "../navigation";

export function alert(message, title) {
    return new Promise(resolve => {
        console.log("Showing alert", title);
        Alert.alert(title, message, [{ text: "OK", onPress: () => resolve() }], { cancelable: false });
    });
}

function connectedRoute(route) {
    if (route.routeName == "Welcome" || route.routeName == "About" || route.routeName == "EasyModeWelcome" || route.routeName == "Connecting" || route.routeName == "Browser") {
        return false;
    }
    return true;
}

export function* navigateHomeOnConnectionLost() {
    yield takeLatest(Types.FIND_DEVICE_LOST, function*(lostDevice) {
        const { deviceStatus, nav } = yield select();
        const route = nav.routes[nav.index];

        if (deviceStatus.connected && deviceStatus.connected.key === lostDevice.address.key) {
            if (connectedRoute(route)) {
                yield put(navigateWelcome());
                yield call(alert, "Device disconnected.", "Alert");
            }
        }
    });
}

export function* connectionRelatedNavigation() {
    return yield all([navigateHomeOnConnectionLost()]);
}
