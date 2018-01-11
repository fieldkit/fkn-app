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

const initialDevicesState = {};

export function devices(state = initialDevicesState, action) {
    let nextState = state;

    if (_.isObject(action.deviceApi)) {
        if (action.deviceApi.success) {
            let update = {};
            update[action.deviceApi.address.key] = {
                address: action.deviceApi.address,
                time: unixNow(),
            };
            nextState = { ...state, ...update };
        }
    }

    switch (action.type) {
    case ActionTypes.FIND_DEVICE_INFO: {
        let update = {};
        update[action.address] = {
            address: action.address,
            time: unixNow(),
        };
        return { ...nextState, ...update };
    }
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

const initialProgressState = {
    depth: 0
};

export function progress(state = initialProgressState, action) {
    let nextState = _.clone(state);

    const api = action.deviceApi;
    if (_.isObject(api)) {
        if (api.blocking) {
            if (api.pending) {
                nextState.depth++;
            }
            else {
                nextState.depth--;
            }
        }
    }

    switch (action.type) {
    default:
        return nextState;
    }
}

const initialDeviceInfoState = {
    status: {
        batteryPercentage: 0,
        uptime: 0
    }
};

export function deviceInfo(state = initialDeviceInfoState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.FIND_DEVICE_SELECT: {
        return { ...nextState, ...{ address: action.address.host } };
    }
    case ActionTypes.DEVICE_STATUS_SUCCESS: {
        return { ...nextState, ...{ status: action.response.status } };
    }
    case ActionTypes.DEVICE_PING_SUCCESS: {
        return { ...nextState, ...{ status: action.response.status } };
    }
    case ActionTypes.DEVICE_CAPABILITIES_SUCCESS: {
        return { ...nextState, ...{ name: action.response.capabilities.name, caps: action.response.capabilities } };
    }
    default:
        return nextState;
    }
}
