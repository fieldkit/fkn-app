'use strict';

import * as Types from './types';

export function deviceStartConnect() {
    return (dispatch, getState) => {
        dispatch({
            type: Types.FIND_DEVICE_START,
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
