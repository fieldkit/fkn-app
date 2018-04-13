import { CALL_DEVICE_API } from '../middleware/device-api';
import { QueryType } from '../lib/protocol';

import * as Types from './types';

export function deviceModuleQuery(id, address, message) {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_MODULE_QUERY_START, Types.DEVICE_MODULE_QUERY_SUCCESS, Types.DEVICE_MODULE_QUERY_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_MODULE,
                module: {
                    id: id,
                    address: address,
                    message: message
                }
            }
        },
    };
}
