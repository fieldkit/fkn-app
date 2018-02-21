'use strict';

import * as ActionTypes from '../../actions/types';

import { decodeWireAtlasReply } from './protocol';

export function atlasReplies(state = {}, action) {
    switch (action.type) {
    case ActionTypes.DEVICE_MODULE_QUERY_FAIL:
        return {
            failed: true,
        };
    case ActionTypes.DEVICE_MODULE_QUERY_SUCCESS: {
        return {
            failed: false,
            reply: decodeWireAtlasReply(action.response.module.message),
        };
    }
    }

    return state;
}
