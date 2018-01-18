'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

import protobuf from "protobufjs";
import { DataRecord } from '../lib/protocol';

const initialDataSetsState = { dataSets: null };

export function dataSets(state = initialDataSetsState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DEVICE_DATA_SETS_SUCCESS:
        return action.response.dataSets;
    default:
        return nextState;
    }
}

const initialDataSetState = null;

export function dataSet(state = initialDataSetState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DEVICE_DATA_SET_SUCCESS:
        if (action.response.dataSets.dataSets.length > 0) {
            return _.cloneDeep(action.response.dataSets.dataSets[0]);
        }
        return nextState;
    case ActionTypes.DEVICE_ERASE_DATA_SET_SUCCESS:
        nextState = _.cloneDeep(state);
        nextState.erased = true;
        return nextState;
    default:
        return nextState;
    }
}

const initialDownloadState = {
    active: false,
    progress: 0,
    data: new Uint8Array([])
};

class DataFileReader {
    constructor(raw) {
        this.reader = protobuf.Reader.create(raw);
    }

    read() {
        if (this.reader.pos >= this.reader.len) {
            return null;
        }
        return DataRecord.decodeDelimited(this.reader);
    }
};

export function download(state = initialDownloadState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DOWNLOAD_DATA_SET_START:
        return {
            active: true,
            progress: 0,
            data: new Uint8Array([]),
        };
    case ActionTypes.DOWNLOAD_DATA_SET_DONE:
        // Do something with the data. It's going away after this.
        const dfr = new DataFileReader(state.data)
        const records = [];
        while (true) {
            const record = dfr.read();
            if (record == null) {
                break;
            }
            records.push(record);
        }

        return {
            active: false,
            progress: 0,
            data: new Uint8Array([]),
            records: records,
        };
    case ActionTypes.DEVICE_DOWNLOAD_DATA_SET_SUCCESS:
        const { response } = action;
        const page = response.dataSetData || response.fileData;

        var newData = new Uint8Array(state.data.length + page.data.length);
        newData.set(state.data);
        newData.set(page.data, state.data.length);

        return {
            active: true,
            progress: state.progress,
            data: newData
        };
    case ActionTypes.DOWNLOAD_DATA_SET_PROGRESS:
        return {
            active: true,
            progress: action.progress,
            data: state.data
        };
    default:
        return nextState;
    }
}
