import { CALL_DEVICE_API } from '../middleware/device-api';
import { QueryType } from '../lib/protocol';

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

export function queryCapabilities() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                }
            },
        });
    };
}

export function queryInfo() {
    return (dispatch, getState) => {
        dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                }
            },
        });

        dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_STATUS_START, Types.DEVICE_STATUS_SUCCESS, Types.DEVICE_STATUS_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_STATUS,
                }
            },
        });
    };
}

export function resetDevice() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_RESET_START, Types.DEVICE_RESET_SUCCESS, Types.DEVICE_RESET_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                noReply: true,
                message: {
                    type: QueryType.values.QUERY_RESET,
                }
            },
        });
    };
}
