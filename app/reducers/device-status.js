'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialDeviceStatusState = {
    started: 0,
    address: {
        valid: false
    },
    api: {
        pending: false
    },
    ping: {
        time: 0
    },
    connected: false
};

export function deviceStatus(state = initialDeviceStatusState, action) {
    let nextState = state;

    if (_.isObject(action.deviceApi)) {
        let update = {
            api: action.deviceApi
        };
        if (!_.isEqual(state.api, update.api)) {
            nextState = { ...state, ...update };
        }
    }

    switch (action.type) {
    case ActionTypes.FIND_DEVICE_START:
        return { ...nextState, ...{ started: unixNow() } };
    case ActionTypes.FIND_DEVICE_INFO:
        return { ...nextState, ...{ address: action.address } };
    case ActionTypes.FIND_DEVICE_SUCCESS:
        return { ...nextState, ...{ connected: true } };
    case ActionTypes.FIND_DEVICE_LOST:
        return { ...nextState, ...{ connected: false } };
    case ActionTypes.DEVICE_PING_SUCCESS:
        nextState.ping = {
            time: unixNow(),
            success: true
        };
        return nextState;
    case ActionTypes.FIND_DEVICE_LOST: {
        nextState.address = {
            valid: false
        };
        return nextState;
    }
    case ActionTypes.DEVICE_PING_FAIL:
        nextState.ping = {
            time: unixNow(),
            success: false
        };
        return nextState;
    default:
        return nextState;
    }
}

const initialDeviceCapabilitiesState = {};

export function deviceCapabilities(state = initialDeviceCapabilitiesState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DEVICE_CAPABILITIES_SUCCESS:
        return action.response.capabilities;
    default:
        return nextState;
    }
}
