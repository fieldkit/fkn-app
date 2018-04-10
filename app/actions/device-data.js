'use strict';

import * as Types from './types';
import { CALL_DEVICE_API } from '../middleware/device-api';

import { QueryType } from '../lib/protocol';

export function queryCapabilities() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                }
            },
        });
    };
}

export function queryInfo() {
    return (dispatch, getState) => {
        dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_CAPABILITIES_START, Types.DEVICE_CAPABILITIES_SUCCESS, Types.DEVICE_CAPABILITIES_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_CAPABILITIES,
                }
            },
        });

        dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_STATUS_START, Types.DEVICE_STATUS_SUCCESS, Types.DEVICE_STATUS_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_STATUS,
                }
            },
        });
    };
}

export function queryConfiguration() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_NETWORK_CONFIGURATION_START, Types.DEVICE_NETWORK_CONFIGURATION_SUCCESS, Types.DEVICE_NETWORK_CONFIGURATION_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_NETWORK_SETTINGS,
                }
            },
        });
    };
}

export function saveNetworkConfiguration(newConfiguration) {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_SAVE_NETWORK_CONFIGURATION_START, Types.DEVICE_SAVE_NETWORK_CONFIGURATION_SUCCESS, Types.DEVICE_SAVE_NETWORK_CONFIGURATION_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_CONFIGURE_NETWORK_SETTINGS,
                    networkSettings: newConfiguration,
                }
            },
        });
    };
}

export function queryFiles() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_FILES_START, Types.DEVICE_FILES_SUCCESS, Types.DEVICE_FILES_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_FILES
                }
            },
        });
    };
}

export function queryDataSets() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_DATA_SETS_START, Types.DEVICE_DATA_SETS_SUCCESS, Types.DEVICE_DATA_SETS_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_DATA_SETS,
                    queryDataSets: {}
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
                address: getState().deviceStatus.connected,
                blocking: true,
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
                address: getState().deviceStatus.connected,
                blocking: true,
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

export function startDownloadDataSet(id) {
    return (dispatch, getState) => {
        return dispatch({
            type: Types.DOWNLOAD_DATA_SET_START,
            id: id,
        });
    };
}

export function startLiveDataPoll() {
    return (dispatch, getState) => {
        return dispatch({
            type: Types.LIVE_DATA_POLL_START
        });
    };
}

export function stopLiveDataPoll() {
    return (dispatch, getState) => {
        return dispatch({
            type: Types.LIVE_DATA_POLL_STOP
        });
    };
}

export function deviceModuleQuery(id, address, message) {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_MODULE_QUERY_START, Types.DEVICE_MODULE_QUERY_SUCCESS, Types.DEVICE_MODULE_QUERY_FAIL],
                address: getState().deviceStatus.connected,
                blocking: true,
                message: {
                    type: QueryType.values.QUERY_MODULE,
                    module: {
                        id: id,
                        address: address,
                        message: message
                    }
                }
            },
        });
    };
}
