import { CALL_DEVICE_API } from "../middleware/device-api";
import { QueryType } from "../lib/protocol";

import * as Types from "./types";

export function deviceStartConnect() {
    // This will cause tests to take forever, they'll wait until the saga to
    // look completes. A quick hack, for now.
    if (typeof __SPECS__ == "undefined") {
        return {
            type: Types.FIND_DEVICE_START
        };
    } else {
        return {
            type: Types.NOOP
        };
    }
}

export function deviceSelect(address) {
    return {
        type: Types.FIND_DEVICE_SELECT,
        address: address
    };
}

export function deviceStopConnect() {
    return {
        type: Types.FIND_DEVICE_STOP
    };
}

export function queryCapabilities(address) {
    return {
        [CALL_DEVICE_API]: {
            types: [
                Types.DEVICE_CAPABILITIES_START,
                Types.DEVICE_CAPABILITIES_SUCCESS,
                Types.DEVICE_CAPABILITIES_FAIL
            ],
            address: address,
            blocking: true,
            message: {
                type: QueryType.values.QUERY_CAPABILITIES
            }
        }
    };
}

export function queryInfo() {
    // TODO: Array/batch middleware?
    return (dispatch, getState) => {
        dispatch({
            [CALL_DEVICE_API]: {
                types: [
                    Types.DEVICE_CAPABILITIES_START,
                    Types.DEVICE_CAPABILITIES_SUCCESS,
                    Types.DEVICE_CAPABILITIES_FAIL
                ],
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES
                }
            }
        });

        dispatch({
            [CALL_DEVICE_API]: {
                types: [
                    Types.DEVICE_STATUS_START,
                    Types.DEVICE_STATUS_SUCCESS,
                    Types.DEVICE_STATUS_FAIL
                ],
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_STATUS
                }
            }
        });
    };
}

export function resetDevice() {
    return {
        [CALL_DEVICE_API]: {
            types: [
                Types.DEVICE_RESET_START,
                Types.DEVICE_RESET_SUCCESS,
                Types.DEVICE_RESET_FAIL
            ],
            blocking: true,
            noReply: true,
            message: {
                type: QueryType.values.QUERY_RESET
            }
        }
    };
}
