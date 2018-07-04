import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialNetworkConfigurationState = {
    network: {
        ssid: null
    },
};

export function networkConfiguration(state = initialNetworkConfigurationState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.WIFI_SSID_CHANGED: {
        return { ...nextState, ...{ network: { ssid: action.ssid } } };
    }
    default:
        return nextState;
    }
}

