import * as ActionTypes from "../actions/types";

export function moduleReplies(state = {}, action) {
    switch (action.type) {
        case ActionTypes.DEVICE_MODULE_QUERY_SUCCESS: {
            return {
                reply: action.response
            };
        }
    }

    return state;
}
