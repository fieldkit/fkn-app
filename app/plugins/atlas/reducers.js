'use strict';

import * as AppActionTypes from '../../actions/types';
import * as AtlasActionTypes from './types';

import { ReplyType as AppReplyType } from '../../lib/protocol';
import { ReplyType as AtlasReplyType, decodeWireAtlasReply } from './protocol';

const initialAtlasCalibrationState = {
    pending: true,
    busy: false,
    error: false,
    probeConfigured: false,
    calibrated: false,
    lastReply: null,
    values: [],
};

function getReplyState(action) {
    if (action.response.type == AppReplyType.values.REPLY_BUSY) {
        return { pending: false, error: false, busy: true, lastReply: null };
    }

    const reply = decodeWireAtlasReply(action.response.module.message);

    if (reply.type == AtlasReplyType.values.REPLY_ERROR) {
        return { pending: false, error: true, busy: false, lastReply: reply };
    }

    return { pending: false, error: false, busy: false, lastReply: reply };
}

export function atlasCalibration(state = initialAtlasCalibrationState, action) {
    switch (action.type) {
    case AtlasActionTypes.ATLAS_CALIBRATION_BEGIN: {
        return initialAtlasCalibrationState;
    }
    case AtlasActionTypes.ATLAS_CALIBRATION_END: {
        return initialAtlasCalibrationState;
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_SET_PROBE_TYPE_START: {
        return { ...state, ...{ pending: true, probeConfigured: false } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_SET_PROBE_TYPE_SUCCESS: {
        const replyState = getReplyState(action);
        return { ...state, ...replyState, ...{ probeConfigured: true } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_CALIBRATE_START: {
        return { ...state, ...{ pending: true, calibrated: false } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_CALIBRATE_SUCCESS: {
        const replyState = getReplyState(action);
        return { ...state, ...replyState, ...{ calibrated: true } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_READING_START: {
        return { ...state, ...{ pending: true } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_READING_SUCCESS: {
        const replyState = getReplyState(action);
        if (!replyState.error) {
            return { ...state, ...replyState, ...{ values: [] } };
        }

        const values = replyState.lastReply.atlasReply.reply.split(",").map(s => Number(s));
        return { ...state, ...replyState, ...{ values: values } };
    }
    }
    return state;
}
