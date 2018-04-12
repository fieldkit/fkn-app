import { CALL_DEVICE_API } from '../middleware/device-api';
import { QueryType } from '../lib/protocol';

import * as Types from './types';

export function startLiveDataPoll() {
    return (dispatch, getState) => {
        return dispatch({
            type: Types.LIVE_DATA_POLL_START
        });
    };
}

export function stopLiveDataPoll() {
    return (dispatch, getState) => {
        return dispatch({
            type: Types.LIVE_DATA_POLL_STOP
        });
    };
}
