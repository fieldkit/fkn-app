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
