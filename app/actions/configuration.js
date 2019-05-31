import { CALL_DEVICE_API } from "../middleware/device-api";
import { QueryType } from "../lib/protocol";

import * as Types from "./types";

export function queryIdentity() {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_QUERY_IDENTITY_START, Types.DEVICE_QUERY_IDENTITY_SUCCESS, Types.DEVICE_QUERY_IDENTITY_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_IDENTITY
            }
        }
    };
}

export function configureName(address, name) {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_CONFIGURE_IDENTITY_START, Types.DEVICE_CONFIGURE_IDENTITY_SUCCESS, Types.DEVICE_CONFIGURE_IDENTITY_FAIL],
            address: address,
            blocking: true,
            message: {
                type: QueryType.values.QUERY_CONFIGURE_IDENTITY,
                identity: {
                    device: name,
                    stream: "",
                }
            }
        }
    };
}

export function queryConfiguration() {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_NETWORK_CONFIGURATION_START, Types.DEVICE_NETWORK_CONFIGURATION_SUCCESS, Types.DEVICE_NETWORK_CONFIGURATION_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_NETWORK_SETTINGS
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
                networkSettings: newConfiguration
            }
        }
    };
}
