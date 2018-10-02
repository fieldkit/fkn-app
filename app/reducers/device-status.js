import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialDeviceStatusState = {
    started: 0,
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
    case ActionTypes.FIND_DEVICE_SELECT: {
        return { ...nextState, ...{ connected: action.address } };
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

export function selectedDevice(state = { }, action) {
    switch (action.type) {
    case ActionTypes.FIND_DEVICE_SELECT: {
        return { connected: action.address };
    }
    }

    return state;
}

const initialDevicesState = {};

export function devices(state = initialDevicesState, action) {
    let nextState = state;

    function mergeUpdate(key, after) {
        const before = state[key] || {};
        const update = {};
        update[key] = { ...before, ...after };
        return { ...nextState, ...update };
    }

    if (_.isObject(action.deviceApi)) {
        if (action.deviceApi.success) {
            const key = state[action.deviceApi.address.key];
            if (_.isObject(state[key])) {
                const update = {};
                update[action.deviceApi.address.key] = {
                    address: action.deviceApi.address,
                    time: unixNow(),
                };
                nextState = { ...state, ...update };
            }
        }
    }

    switch (action.type) {
    case ActionTypes.FIND_DEVICE_SUCCESS: {
        const key = action.address.key;
        const after = {
            address: action.address,
            capabilities: action.capabilities,
            time: unixNow(),
        };
        return mergeUpdate(key, after);
    }
    case ActionTypes.DEVICE_FILES_SUCCESS: {
        const key = action.deviceApi.address.key;
        const after = {
            files: action.response.files.files,
            time: unixNow(),
        };
        return mergeUpdate(key, after);
    }
    case ActionTypes.DEVICE_ERASE_FILE_SUCCESS: {
        const key = action.deviceApi.address.key;
        const after = {
            files: action.response.files.files,
            time: unixNow(),
        };
        return mergeUpdate(key, after);
    }
    case ActionTypes.DEVICE_STATUS_SUCCESS: {
        const key = action.deviceApi.address.key;
        const after = {
            status: action.response.status,
            time: unixNow(),
        };
        return mergeUpdate(key, after);
    }
    case ActionTypes.DEVICE_CAPABILITIES_SUCCESS: {
        const key = action.deviceApi.address.key;
        const after = {
            capabilities: action.response.capabilities,
            time: unixNow(),
        };
        return mergeUpdate(key, after);
    }
    case ActionTypes.DEVICE_NETWORK_CONFIGURATION_SUCCESS: {
        const key = action.deviceApi.address.key;
        const after = {
            networkSettings: action.response.networkSettings,
            time: unixNow(),
        };
        return mergeUpdate(key, after);
    }
    case ActionTypes.DEVICE_SAVE_NETWORK_CONFIGURATION_SUCCESS: {
        const key = action.deviceApi.address.key;
        const after = {
            networkSettings: action.response.networkSettings,
            time: unixNow(),
        };
        return mergeUpdate(key, after);
    }
    default:
        return nextState;
    }
}
