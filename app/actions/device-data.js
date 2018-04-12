import varint from 'varint';
import protobuf from "protobufjs";

import { QueryType } from '../lib/protocol';
import { WireMessageReply } from '../lib/protocol';

import { CALL_DEVICE_API } from '../middleware/device-api';

import * as Types from './types';

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

export function startDownloadFile(id) {
    return (dispatch, getState) => {
        return dispatch({
            type: Types.DOWNLOAD_FILE_START,
            id: id,
        });
    };
}

class DownloadWriter {
    constructor(file, dispatch) {
        this.file = file;
        this.dispatch = dispatch;
        this.bytesRead = 0;
        this.started = new Date();
    }

    write(data) {
        // TODO: Allow blocks to be split in the middle.
        const reader = protobuf.Reader.create(data);
        while (reader.pos < reader.len) {
            const decoded = WireMessageReply.decodeDelimited(reader);
            const blockSize = decoded.fileData.data.length;

            this.bytesRead += blockSize;

            this.progress(Types.DOWNLOAD_FILE_PROGRESS);
        }
    }

    close() {
        this.progress(Types.DOWNLOAD_FILE_DONE);
    }

    progress(type) {
        const now = new Date();
        this.dispatch({
            type: type,
            download: {
                done: type == Types.DOWNLOAD_FILE_DONE,
                bytesTotal: this.file.size,
                bytesRead: this.bytesRead,
                progress: this.bytesRead / this.file.size,
                started: this.started,
                elapsed: now - this.started,
            }
        });
    }
};

export function queryDownloadFile(file) {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [Types.DEVICE_DOWNLOAD_FILE_START, Types.DEVICE_DOWNLOAD_FILE_SUCCESS, Types.DEVICE_DOWNLOAD_FILE_FAIL],
                address: getState().deviceStatus.connected,
                writer: new DownloadWriter(file, dispatch),
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
