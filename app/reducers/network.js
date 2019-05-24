import _ from "lodash";
import * as ActionTypes from "../actions/types";
import { unixNow } from "../lib/helpers";

const initialNetworkConfigurationState = {
    network: {
        ssid: null
    },
    internet: {
        online: false
    }
};

export function networkConfiguration(state = initialNetworkConfigurationState, action) {
    let nextState = state;

    switch (action.type) {
        case ActionTypes.INTERNET_ONLINE: {
            return {
                ...nextState,
                ...{ internet: action }
            };
        }
        case ActionTypes.INTERNET_OFFLINE: {
            return {
                ...nextState,
                ...{ internet: action }
            };
        }
        case ActionTypes.WIFI_SSID_CHANGED: {
            return {
                ...nextState,
                ...{ network: { ssid: action.ssid, deviceAp: false } }
            };
        }
        default:
            return nextState;
    }
}
