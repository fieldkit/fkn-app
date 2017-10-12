'use strict';

import _ from 'lodash';
import ServiceDiscovery from "react-native-service-discovery";
import { Alert, ToastAndroid } from 'react-native';

import * as Types from './types';
import { CALL_DEVICE_API } from '../middleware/device-api';
import { unixNow } from '../lib/helpers';

import {
    navigateWelcome,
    navigateDeviceMenu
} from './navigation';

import {
    QueryType
} from '../lib/protocol';

import Mailer from 'react-native-mail';

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

export function queryDataSet(id) {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_DATA_SET_START, Types.DEVICE_DATA_SET_SUCCESS, Types.DEVICE_DATA_SET_FAIL],
                address: getState().deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_DATA_SET,
                    queryDataSet: {
                        id: id
                    }
                }
            },
        });
    };
}

export function eraseDataSet(id) {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_ERASE_DATA_SET_START, Types.DEVICE_ERASE_DATA_SET_SUCCESS, Types.DEVICE_ERASE_DATA_SET_FAIL],
                address: getState().deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_ERASE_DATA_SET,
                    eraseDataSet: {
                        id: id
                    }
                }
            },
        });
    };
}

export function emailDataSet(id) {
    return (dispatch, getState) => {
        Mailer.mail({
            subject: 'FieldKit NOAA-CTD Data',
            recipients: ['jlewalle@gmail.com'],
            body: '<p>Please see the attached file, data.csv.</p><br/><p>Thanks!</p>',
            isHTML: true,
            /*
            attachment: {
                path: '',
                type: 'text/csv',
                name: 'data.csv',
            }
            */
        }, (error, event) => {
            Alert.alert(
                error,
                event,
                [
                    {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
                    {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
                ],
                { cancelable: true }
            )

            dispatch({
                type: Types.EMAIL_DATA_SET_SUCCESS,
                id: id
            });

            ToastAndroid.show('E-mail sent successfully.', ToastAndroid.SHORT);
        });
    };
}

export function queryDataSets() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_DATA_SETS_START, Types.DEVICE_DATA_SETS_SUCCESS, Types.DEVICE_DATA_SETS_FAIL],
                address: getState().deviceStatus.address,
                message: {
                    type: QueryType.values.QUERY_DATA_SETS,
                    queryDataSets: {}
                }
            },
        });
    };
}

let serviceDiscovery = null;
let pingTimer = null;

function tick() {
    return (dispatch, getState) => {
        const { nav, deviceStatus } = getState();
        const route = nav.routes[nav.index];

        if (deviceStatus.address.valid) {
            if (!deviceStatus.api.pending) {
                if (unixNow() - deviceStatus.ping.time > 30) {
                    devicePing()(dispatch, getState);
                }
                else {
                    if (deviceStatus.ping.success) {
                        if (_.isObject(route.params) && route.params.connecting === true) {
                            dispatch(queryDeviceCapabilities());
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
            if (unixNow() - deviceStatus.started > 60) {
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
                const oldAddress = getState().deviceStatus.address;
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
