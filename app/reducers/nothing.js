import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const nothing = createReducer({}, {
    [types.NOTHING](state, action) {
        return state;
    }
});
