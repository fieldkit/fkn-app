'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialState = {
    started: 0,
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
        let update = {
            api: action.deviceApi
        };
        if (!_.isEqual(state.api, update.api)) {
            nextState = { ...state, ...update };
        }
    }

    switch (action.type) {
    case ActionTypes.DEVICE_CONNECT_START:
        return { ...nextState, ...{ started: unixNow() } };
    case ActionTypes.DEVICE_CONNECT_INFO:
        return { ...nextState, ...{ address: action.address } };
    case ActionTypes.DEVICE_PING_SUCCESS:
        nextState.ping = {
            time: action.response.time,
            success: true
        };
        return nextState;
    case ActionTypes.DEVICE_PING_FAIL:
        nextState.address = {
            valid: false
        };
        nextState.ping = {
            time: unixNow(),
            success: false
        };
        return nextState;
    default:
        return nextState;
    }
}
