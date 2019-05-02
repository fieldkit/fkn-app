import { delay } from "redux-saga";
import { put, take, takeLatest, takeEvery, select, all, race, call } from "redux-saga/effects";

import * as AppActionTypes from "../../actions/types";
import { QueryType as AppQueryType } from "../../lib/protocol";

import * as AtlasActionTypes from "./types";
import { deviceCall } from "../../actions/sagas/saga-utils";
import { CALL_DEVICE_API } from "../../middleware/device-api";

import { QueryType, SensorType, atlasSensorQuery, encodeWireAtlasQuery, decodeWireAtlasReply } from "./protocol";

export function atlasCalibrationBegin() {
    return {
        type: AtlasActionTypes.ATLAS_CALIBRATION_BEGIN
    };
}

export function atlasCalibrationEnd() {
    return {
        type: AtlasActionTypes.ATLAS_CALIBRATION_END
    };
}

export function atlasCalibrationTemperatureSet(temperature) {
    return {
        type: AtlasActionTypes.ATLAS_CALIBRATION_TEMPERATURE_SET,
        temperature: temperature
    };
}

export function atlasReadSensor(sensor) {
    return {
        type: AtlasActionTypes.ATLAS_READ_SENSOR_START,
        sensor: sensor
    };
}

export function atlasSensorCommand(types, blocking, sensor, command) {
    const query = atlasSensorQuery(sensor, command);
    const encoded = encodeWireAtlasQuery(query);

    console.log("Custom command size:", encoded.length);

    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: types,
                address: getState().deviceStatus.connected,
                blocking: blocking,
                message: {
                    type: AppQueryType.values.QUERY_MODULE,
                    module: {
                        id: 8,
                        address: 8,
                        message: encoded
                    }
                }
            }
        });
    };
}

export function atlasSetProbeType(sensor, command, probeType) {
    return (dispatch, getState) => {
        dispatch({
            type: AtlasActionTypes.ATLAS_CALIBRATION_PROBE_TYPE_SET,
            probeType: probeType
        });

        const types = [AtlasActionTypes.DEVICE_ATLAS_SENSOR_SET_PROBE_TYPE_START, AtlasActionTypes.DEVICE_ATLAS_SENSOR_SET_PROBE_TYPE_SUCCESS, AtlasActionTypes.DEVICE_ATLAS_SENSOR_SET_PROBE_TYPE_FAIL];
        const sensorCommand = atlasSensorCommand(types, true, sensor, command);
        return sensorCommand(dispatch, getState);
    };
}

export function atlasCalibrate(sensor, command) {
    const types = [AtlasActionTypes.DEVICE_ATLAS_SENSOR_CALIBRATE_START, AtlasActionTypes.DEVICE_ATLAS_SENSOR_CALIBRATE_SUCCESS, AtlasActionTypes.DEVICE_ATLAS_SENSOR_CALIBRATE_FAIL];
    return atlasSensorCommand(types, true, sensor, command);
}

export function atlasReading(sensor) {
    const types = [AtlasActionTypes.DEVICE_ATLAS_SENSOR_READING_START, AtlasActionTypes.DEVICE_ATLAS_SENSOR_READING_SUCCESS, AtlasActionTypes.DEVICE_ATLAS_SENSOR_READING_FAIL];
    return atlasSensorCommand(types, false, sensor, "R");
}

function* takeAtlasReadings() {
    yield takeLatest([AtlasActionTypes.ATLAS_READ_SENSOR_START], function*(start) {
        while (true) {
            yield call(deviceCall, atlasReading(start.sensor));

            const { stopped, to } = yield race({
                stopped: take([AtlasActionTypes.ATLAS_READ_SENSOR_STOP, AtlasActionTypes.ATLAS_CALIBRATION_END]),
                to: delay(2000)
            });

            if (stopped) {
                break;
            }
        }
    });
}

export function* atlasSagas() {
    yield all([takeAtlasReadings()]);
}
