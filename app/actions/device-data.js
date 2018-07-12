import { CALL_DEVICE_API, cancelPendingDeviceCalls } from '../middleware/device-api';

import { QueryType } from '../lib/protocol';
import { openWriter } from '../lib/downloading';

import * as Types from './types';

export function queryFiles(address) {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_FILES_START, Types.DEVICE_FILES_SUCCESS, Types.DEVICE_FILES_FAIL],
            address: address,
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

export function deleteFile(id) {
    return {
        [CALL_DEVICE_API]: {
            types: [Types.DEVICE_ERASE_FILE_START, Types.DEVICE_ERASE_FILE_SUCCESS, Types.DEVICE_ERASE_FILE_FAIL],
            blocking: true,
            message: {
                type: QueryType.values.QUERY_ERASE_FILE,
                eraseFile: {
                    id: id
                }
            }
        }
    };
}

export function cancelInProgressOperation() {
    cancelPendingDeviceCalls();

    return {
        type: Types.OPERATION_CANCEL
    };
}

export function queryDownloadFile(device, file, settings, address) {
    return (dispatch) => {
        return openWriter(device, file, settings, dispatch).then(writer => {
            return dispatch({
                [CALL_DEVICE_API]: {
                    types: [Types.DEVICE_DOWNLOAD_FILE_START, Types.DEVICE_DOWNLOAD_FILE_SUCCESS, Types.DEVICE_DOWNLOAD_FILE_FAIL],
                    address: address,
                    writer: writer,
                    message: {
                        type: QueryType.values.QUERY_DOWNLOAD_FILE,
                        downloadFile: {
                            id: file.id,
                            offset: writer.settings.offset,
                            length: writer.settings.length,
                        }
                    }
                }
            });
        });
    };
}

