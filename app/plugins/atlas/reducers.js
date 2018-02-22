'use strict';

import * as AppActionTypes from '../../actions/types';
import * as AtlasActionTypes from './types';

import { ReplyType as AppReplyType } from '../../lib/protocol';
import { ReplyType as AtlasReplyType, decodeWireAtlasReply } from './protocol';

import { AtlasCommands } from './AtlasCommands';

const atlasCommands = new AtlasCommands();

const initialReplyState = {
    pending: true,
    error: false,
    done: false,
    lastReply: null,
};

const initialAtlasCalibrationState = {
    values: [],
    temperature: 25,
    commands: atlasCommands.getCommands(25),
    probeConfiguration: initialReplyState,
    calibration: initialReplyState,
    reading: initialReplyState,
};

function getPendingReplyState(action) {
    return {
        pending: true,
        error: false,
        done: false,
        lastReply: null,
    };
}

function getReplyState(action) {
    if (action.response.type == AppReplyType.values.REPLY_BUSY) {
        return { pending: false, error: true, done: false, lastReply: null };
    }

    const reply = decodeWireAtlasReply(action.response.module.message);
    if (reply.type == AtlasReplyType.values.REPLY_ERROR) {
        return { pending: false, error: true, done: false, lastReply: reply };
    }

    return { pending: false, error: false, done: true, lastReply: reply };
}

export function atlasState(state = initialAtlasCalibrationState, action) {
    switch (action.type) {
    case AtlasActionTypes.ATLAS_CALIBRATION_BEGIN: {
        return initialAtlasCalibrationState;
    }
    case AtlasActionTypes.ATLAS_CALIBRATION_END: {
        return initialAtlasCalibrationState;
    }
    case AtlasActionTypes.ATLAS_CALIBRATION_TEMPERATURE_SET: {
        return { ...state, ...{ temperature: action.temperature, commands: atlasCommands.getCommands(action.temperature) } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_SET_PROBE_TYPE_START: {
        return { ...state, ...{ probeConfiguration: getPendingReplyState(action) } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_SET_PROBE_TYPE_SUCCESS: {
        const replyState = getReplyState(action);
        return { ...state, ...{ probeConfiguration: getReplyState(action) } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_CALIBRATE_START: {
        return { ...state, ...{ calibration: getPendingReplyState(action) } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_CALIBRATE_SUCCESS: {
        return { ...state, ...{ calibration: getReplyState(action) } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_READING_START: {
        return { ...state, ...{ reading: getPendingReplyState(action) } };
    }
    case AtlasActionTypes.DEVICE_ATLAS_SENSOR_READING_SUCCESS: {
        const replyState = getReplyState(action);
        if (replyState.error || replyState.lastReply == null) {
            return { ...state, ...{ values: [], reading: replyState } };
        }
        const values = replyState.lastReply.atlasReply.reply.split(",").map(s => Number(s));
        return { ...state, ...{ values: values, reading: replyState } };
    }
    }
    return state;
}
