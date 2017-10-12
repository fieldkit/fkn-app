'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialDataSetsState = { dataSets: null };

export function dataSets(state = initialDataSetsState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DEVICE_DATA_SETS_SUCCESS:
        return action.response.dataSets;
    default:
        return nextState;
    }
}

const initialDataSetState = null;

export function dataSet(state = initialDataSetState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DEVICE_DATA_SET_SUCCESS:
        return _.cloneDeep(action.response.dataSets.dataSets[0]);
    case ActionTypes.DEVICE_ERASE_DATA_SET_SUCCESS:
        nextState = _.cloneDeep(state);
        nextState.erased = true;
        return nextState;
    default:
        return nextState;
    }
}
