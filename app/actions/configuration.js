import { CALL_DEVICE_API } from '../middleware/device-api';
import { QueryType } from '../lib/protocol';

import * as Types from './types';

export function queryConfiguration() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_NETWORK_CONFIGURATION_START, Types.DEVICE_NETWORK_CONFIGURATION_SUCCESS, Types.DEVICE_NETWORK_CONFIGURATION_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_NETWORK_SETTINGS,
                }
            },
        });
    };
}

export function saveNetworkConfiguration(newConfiguration) {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_SAVE_NETWORK_CONFIGURATION_START, Types.DEVICE_SAVE_NETWORK_CONFIGURATION_SUCCESS, Types.DEVICE_SAVE_NETWORK_CONFIGURATION_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_CONFIGURE_NETWORK_SETTINGS,
                    networkSettings: newConfiguration,
                }
            },
        });
    };
}

