import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialEasyModeState = {
    devices: [],
    storage: {
        queue: []
    }
};

export function easyMode(state = initialEasyModeState, action) {
    let nextState = state;

    switch (action.type) {
    default:
        return nextState;
    }
}
