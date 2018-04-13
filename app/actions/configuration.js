import { CALL_DEVICE_API } from '../middleware/device-api';
import { QueryType } from '../lib/protocol';

import * as Types from './types';

export function queryConfiguration() {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_NETWORK_CONFIGURATION_START, Types.DEVICE_NETWORK_CONFIGURATION_SUCCESS, Types.DEVICE_NETWORK_CONFIGURATION_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_NETWORK_SETTINGS,
            }
        }
    };
}

export function saveNetworkConfiguration(newConfiguration) {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_SAVE_NETWORK_CONFIGURATION_START, Types.DEVICE_SAVE_NETWORK_CONFIGURATION_SUCCESS, Types.DEVICE_SAVE_NETWORK_CONFIGURATION_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_CONFIGURE_NETWORK_SETTINGS,
                networkSettings: newConfiguration,
            }
        }
    };
}

