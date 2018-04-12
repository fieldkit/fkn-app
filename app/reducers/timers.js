import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

export function timers(state = { }, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.TIMER_START: {
        const timer = {};
        timer[action.name] = { ...{ started: unixNow() }, ...action };
        return { ...nextState, ...timer };
    }
    case ActionTypes.TIMER_TICK: {
        const timer = {};
        timer[action.name] = action;
        return { ...nextState, ...timer };
    }
    case ActionTypes.TIMER_DONE: {
        const timer = {};
        timer[action.name] = { ...{ finished: unixNow() }, ...action };
        return { ...nextState, ...timer };
    }
    case ActionTypes.TIMER_CANCEL: {
        nextState = _.clone(state);
        delete nextState[action.name];
        return nextState;
    }
    default:
        return nextState;
    }
}

