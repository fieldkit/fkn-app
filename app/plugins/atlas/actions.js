import * as ActionTypes from './types';

export function atlasCalibrationStep(newStep) {
    return {
        type: ActionTypes.ATLAS_CALIBRATION_STEP,
        step: newStep,
    };
}

import { delay } from 'redux-saga';
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects';

function* atlasCalibrationSaga() {

}

export function* atlasSagas() {
    yield all([]);
}
