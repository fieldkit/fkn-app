'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialConfigurationState = {
    network: {},
};

export function deviceConfiguration(state = initialConfigurationState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DEVICE_NETWORK_CONFIGURATION_SUCCESS: {
        return { ...nextState, ...{ network: action.response.networkSettings } };
    }
    case ActionTypes.DEVICE_SAVE_NETWORK_CONFIGURATION_SUCCESS: {
        return { ...nextState, ...{ network: action.response.networkSettings } };
    }
    default:
        return nextState;
    }
}

