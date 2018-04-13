import { CALL_DEVICE_API } from '../middleware/device-api';

import { QueryType } from '../lib/protocol';
import { openWriter } from '../lib/downloading';

import * as Types from './types';

export function queryFiles() {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_FILES_START, Types.DEVICE_FILES_SUCCESS, Types.DEVICE_FILES_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_FILES
            }
        },
    };
}

export function startDownloadFile(id) {
    return {
        type: Types.DOWNLOAD_FILE_START,
        id: id,
    };
}

export function queryDownloadFile(device, file) {
    return (dispatch) => {
        return openWriter(device, file, dispatch).then(writer => {
            return dispatch({
                [CALL_DEVICE_API]: {
                    types: [Types.DEVICE_DOWNLOAD_FILE_START, Types.DEVICE_DOWNLOAD_FILE_SUCCESS, Types.DEVICE_DOWNLOAD_FILE_FAIL],
                    writer: writer,
                    message: {
                        type: QueryType.values.QUERY_DOWNLOAD_FILE,
                        downloadFile: {
                            id: file.id,
                            pageSize: 0,
                            page: 0,
                        }
                    }
                }
            });
        });
    }
}

export function queryDataSets() {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_DATA_SETS_START, Types.DEVICE_DATA_SETS_SUCCESS, Types.DEVICE_DATA_SETS_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_DATA_SETS,
                queryDataSets: {}
            }
        }
    };
}

export function queryDataSet(id) {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_DATA_SET_START, Types.DEVICE_DATA_SET_SUCCESS, Types.DEVICE_DATA_SET_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_DATA_SET,
                queryDataSet: {
                    id: id
                }
            }
        }
    };
}

export function eraseDataSet(id) {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_ERASE_DATA_SET_START, Types.DEVICE_ERASE_DATA_SET_SUCCESS, Types.DEVICE_ERASE_DATA_SET_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_ERASE_DATA_SET,
                eraseDataSet: {
                    id: id
                }
            }
        }
    };
}

export function startDownloadDataSet(id) {
    return {
        type: Types.DOWNLOAD_DATA_SET_START,
        id: id,
    };
}
