'use strict';

import _ from 'lodash';
import ServiceDiscovery from "react-native-service-discovery";

import * as Types from './types';
import { CALL_DEVICE_API } from '../middleware/device-api';
import { unixNow } from '../lib/helpers';

import {
    navigateWelcome,
    navigateDeviceMenu
} from './nav';

import {
    QueryType
} from '../lib/protocol';

export function devicePing() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_PING_START, Types.DEVICE_PING_SUCCESS, Types.DEVICE_PING_FAIL],
                address: getState().deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                    queryCapabilities: {
                        version: 1
                    }
                }
            },
        });
    };
}

export function queryDeviceCapabilities() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
                address: getState().deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                    queryCapabilities: {
                        version: 1
                    }
                }
            },
        });
    };
}

let serviceDiscovery = null;
let pingTimer = null;

function tick() {
    return (dispatch, getState) => {
        const { nav, device } = getState();
        const route = nav.routes[nav.index];

        if (device.address.valid) {
            if (!device.api.pending) {
                if (unixNow() - device.ping.time > 10) {
                    devicePing()(dispatch, getState);
                }
                else {
                    if (device.ping.success) {
                        if (_.isObject(route.params) && route.params.connecting === true) {
                            dispatch(navigateDeviceMenu());
                        }
                    }
                    else {
                        if (_.isObject(route.params) && route.params.connectionRequired === true) {
                            dispatch(navigateWelcome());
                        }
                    }
                }
            }
            else {

            }
        }
        else {
            if (unixNow() - device.started > 30) {
                if (_.isObject(route.params) && route.params.connecting === true) {
                    dispatch(navigateWelcome());
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
