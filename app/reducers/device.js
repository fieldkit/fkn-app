'use strict';

import * as ActionTypes from '../actions/types';

export function deviceAddress(state = { }, action) {
    switch (action.type) {
    case ActionTypes.DEVICE_CONNECT_INFO:
        return { ...state, ...action.info };
    default:
        return state;
    }
}
