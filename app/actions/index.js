'use strict';

import * as Types from './types';
import { CALL_DEVICE_API } from '../middleware/device-api';

import ServiceDiscovery from "react-native-service-discovery";

export function navigateWelcome() {
    return {
        type: Types.NAVIGATION_WELCOME,
    };
}

export function navigateConnecting() {
    return {
        type: Types.NAVIGATION_CONNECTING,
    };
}

export function navigateAbout() {
    return {
        type: Types.NAVIGATION_ABOUT,
    };
}

export function devicePing() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_PING_START, Types.DEVICE_PING_SUCCESS, Types.DEVICE_PING_FAILED],
                call: (api) => api.ping({}),
            },
        });
    };
}

let serviceDiscovery = null;
let connectingTimer = null;

function deviceStartConnectTry(dispatch) {
    dispatch({
        type: Types.DEVICE_CONNECT_TRY,
    });
}

export function deviceStartConnect() {
    return (dispatch, getState) => {
        dispatch({
            type: Types.DEVICE_CONNECT_START,
        });

        if (serviceDiscovery === null) {
            serviceDiscovery = new ServiceDiscovery();

            serviceDiscovery.on('service-resolved', (ev) => {
            });

            serviceDiscovery.on('udp-discovery', (ev) => {
                const oldState = getState().deviceAddress;
                if (oldState.address != ev.address || oldState.port != ev.port) {
                    dispatch({
                        type: Types.DEVICE_CONNECT_INFO,
                        info: {
                            address: ev.address,
                            port: ev.port,
                        },
                    });
                }
            });
        }

        serviceDiscovery.start();

        deviceStartConnectTry(dispatch);

        clearInterval(connectingTimer);
        connectingTimer = setInterval(() => {
            deviceStartConnectTry(dispatch);
        }, 5000);
    };
}

export function deviceStopConnect() {
    return (dispatch, getState) => {
        if (connectingTimer != null) {
            clearInterval(connectingTimer);
            connectingTimer = null;
        }

        dispatch({
            type: Types.DEVICE_CONNECT_STOP,
        });
    };
}
