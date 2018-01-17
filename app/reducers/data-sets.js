'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

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

class BinaryReader {
    constructor(raw, offset) {
        this.length = raw.length;
        this.dv = new DataView(raw.buffer, offset);
        this.o = 0;
    }

    readFloat32() {
        const value = this.dv.getFloat32(this.o, true);
        this.o += 4;
        return value;
    }

    readUint32() {
        const value = this.dv.getUint32(this.o, true);
        this.o += 4;
        return value;
    }

    isEof() {
        return this.o >= this.length;
    }
}

class DeviceLocation {
}

class LoggedSensorReading {
}

class DataEntry {
}

class DataEntryReader {
    constructor(reader) {
        this.r = reader;
    }

    readDataEntry() {
        if (this.r.isEof()) {
            return null;
        }
        const de = new DataEntry();
        de.version = this.r.readUint32(); this.o += 4;
        de.location = this.readLocation();
        de.reading = this.readSensorReading();
        return de;
    }

    readLocation() {
        const val = new DeviceLocation();
        val.fix = this.r.readUint32();
        val.time = this.r.readUint32();
        val.lon = this.r.readFloat32();
        val.lat = this.r.readFloat32();
        val.alt = this.r.readFloat32();
        return val;
    }

    readSensorReading() {
        const val = new LoggedSensorReading();
        val.time = this.r.readUint32();
        val.sensor = this.r.readUint32();
        val.value = this.r.readFloat32();
        return val;
    }
}

class DataFileReader {
    constructor(raw) {
        this.reader = new BinaryReader(raw, 0);
        this.der = new DataEntryReader(this.reader);
    }

    read() {
        return this.der.readDataEntry();
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

        while (true) {
            const de = dfr.read();
            if (de == null) {
                break;
            }
            console.log(de)
        }

        return initialDownloadState;
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
