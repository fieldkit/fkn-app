'use strict';

import * as Types from './types';

export function deviceStartConnect() {
    return (dispatch, getState) => {
        dispatch({
            type: Types.FIND_DEVICE_START,
        });
    };
}

export function deviceSelect(address) {
    return (dispatch, getState) => {
        dispatch({
            type: Types.FIND_DEVICE_SELECT,
            address: address,
        });
    };
}

export function deviceStopConnect() {
    return (dispatch, getState) => {
        dispatch({
            type: Types.FIND_DEVICE_STOP,
        });
    };
}
