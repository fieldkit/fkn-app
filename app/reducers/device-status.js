'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialDeviceStatusState = {
    started: 0,
    addresses: {
    },
    address: {
        valid: false
    },
    api: {
        pending: false
    },
    ping: {
        time: 0
    },
    connected: null
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
    case ActionTypes.FIND_DEVICE_START: {
        return { ...nextState, ...{ started: unixNow() } };
    }
    case ActionTypes.FIND_DEVICE_INFO: {
        const nextAddresses = { ...nextState.addresses };
        nextAddresses[action.address.host] = { ...action.address, ...{ seen: unixNow() } };
        return { ...nextState, ...{ addresses: nextAddresses } };
    }
    case ActionTypes.FIND_DEVICE_SELECT: {
        return { ...nextState, ...{ connected: action.address } };
    }
    case ActionTypes.FIND_DEVICE_SUCCESS: {
        return { ...nextState, ...{ } };
    }
    case ActionTypes.FIND_DEVICE_LOST: {
        const nextAddresses = { ...nextState.addresses };
        delete nextAddresses[action.address.host];
        if (state.connected && state.connected.host == action.address.host) {
            return { ...nextState, ...{ addresses: nextAddresses, connected: null } };
        }
        return { ...nextState, ...{ addresses: nextAddresses } };
    }
    case ActionTypes.DEVICE_PING_SUCCESS: {
        nextState.ping = {
            time: unixNow(),
            success: true
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

const initialDeviceInfoState = {};

export function deviceInfo(state = initialDeviceInfoState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.FIND_DEVICE_SELECT: {
        return { ...nextState, ...{ address: action.address.host } };
    }
    case ActionTypes.DEVICE_CAPABILITIES_SUCCESS: {
        return { ...nextState, ...{ name: action.response.capabilities.name } };
    }
    default:
        return nextState;
    }
}
