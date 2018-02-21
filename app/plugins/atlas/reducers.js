'use strict';

import * as ActionTypes from '../../actions/types';

import { ReplyType } from '../../lib/protocol';
import { decodeWireAtlasReply } from './protocol';

export function atlasReplies(state = {}, action) {
    switch (action.type) {
    case ActionTypes.DEVICE_MODULE_QUERY_START:
        return {
            pending: true,
            busy: false,
        };
    case ActionTypes.DEVICE_MODULE_QUERY_FAIL:
        return {
            failed: true,
            busy: false,
        };
    case ActionTypes.DEVICE_MODULE_QUERY_SUCCESS: {
        if (action.response.type == ReplyType.values.REPLY_BUSY) {
            return {
                busy: true
            };
        }
        return {
            failed: false,
            busy: false,
            reply: decodeWireAtlasReply(action.response.module.message),
        };
    }
    }

    return state;
}
