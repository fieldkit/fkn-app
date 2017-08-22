'use strict';

import _ from 'lodash';
import ServiceDiscovery from "react-native-service-discovery";

import * as Types from './types';
import { CALL_DEVICE_API } from '../middleware/device-api';
import { unixNow } from '../lib/helpers';

import { navigateDeviceMenu } from './nav';

export function devicePing() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_PING_START, Types.DEVICE_PING_SUCCESS, Types.DEVICE_PING_FAILED],
                address: getState().device.address,
                call: (api) => api.ping({ time: unixNow() }),
            },
        });
    };
}

let serviceDiscovery = null;
let pingTimer = null;

function tick() {
    return (dispatch, getState) => {
        const { nav, device } = getState();

        if (device.address.valid && !device.api.pending) {
            if (unixNow() - device.ping.time > 10) {
                devicePing()(dispatch, getState);
            }
            else {
                if (device.ping.success) {
                    const route = nav.routes[nav.index];
                    console.log(route);
                    if (route.routeName == "Connecting") {
                        dispatch(navigateDeviceMenu());
                    }
                }
            }
        }
    };
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
                const oldAddress = getState().device.address;
                const address = {
                    host: ev.address,
                    port: ev.port,
                    valid: true
                };
                if (!_.isEqual(oldAddress, address)) {
                    dispatch({
                        type: Types.DEVICE_CONNECT_INFO,
                        address: address
                    });
                }
            });
        }

        serviceDiscovery.start();

        clearInterval(pingTimer);
        pingTimer = setInterval(() => {
            tick()(dispatch, getState);
        }, 1000);
    };
}

export function deviceStopConnect() {
    return (dispatch, getState) => {
        if (pingTimer != null) {
            clearInterval(pingTimer);
            pingTimer = null;
        }

        dispatch({
            type: Types.DEVICE_CONNECT_STOP,
        });
    };
}
