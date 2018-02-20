import * as ActionTypes from './types';

export function atlasCalibratePh() {
    return {
        type: ActionTypes.ATLAS_NAVIGATE_CALIBRATE_PH,
    };
}

export function atlasCalibrateTemp() {
    return {
        type: ActionTypes.ATLAS_NAVIGATE_CALIBRATE_TEMP,
    };
}

import { delay } from 'redux-saga';
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects';

function* atlasCalibrationSaga() {
    while (true) {
        yield delay(1000);
        console.log("Calibration Saga");
    }
}

export function* atlasSagas() {
    yield all([
        atlasCalibrationSaga(),
    ]);
}
