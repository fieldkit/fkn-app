'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';

const initialState = {
    address: {
        valid: false
    },
    api: {
        pending: false
    },
    ping: {
        time: 0
    }
};

export function device(state = initialState, action) {
    let nextState = state;

    if (_.isObject(action.deviceApi)) {
        const update = {
            api: action.deviceApi
        };
        if (!_.isEqual(state.api, update.api)) {
            nextState = { ...state, ...update };
        }
    }

    switch (action.type) {
    case ActionTypes.DEVICE_CONNECT_INFO:
        const update = {
            address: action.address
        };
        return { ...nextState, ...update };
    case ActionTypes.DEVICE_PING_FAILED:
        nextState.ping = {
            time: action.response.time,
            success: false
        };
        return nextState;
    case ActionTypes.DEVICE_PING_SUCCESS:
        nextState.ping = {
            time: action.response.time,
            success: true
        };
        return nextState;
    default:
        return nextState;
    }
}
