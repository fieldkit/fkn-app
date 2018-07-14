import _ from 'lodash';
import * as ActionTypes from '../actions/types';

import { hexArrayBuffer, base64ArrayBuffer } from '../lib/base64';

import { generateDownloadPlan, generateUploadPlan } from './synchronizing';

function tryParseDeviceIdPath(path) {
    // Example: 0004a30b001cc468
    const re = /([0-9a-fA-F]{16})/;
    const match = path.replace("/", "").match(re);
    if (match === null) {
        return null;
    }
    return match[1];
}

const initialFileComparisonsState = {
    map: {},
    devices: {}
};

const Configuration = [ {
    fileId: 4,
    chunked: 0,
    offset: 0,
    length: 0,
    condition: (file, others) => true,
}, {
    fileId: 2,
    tail: 1000000,
    offset: 0,
    length: 0,
    condition: (file, others) => {
        return _(others).filter(f => f.id == 3 && f.size == 0 || f.size > file.size).some();
    }
}, {
    fileId: 3,
    tail: 1000000,
    offset: 0,
    length: 0,
    condition: (file, others) => {
        return _(others).filter(f => f.id == 2 && f.size == 0 || f.size > file.size).some();
    }
}];

const initialDeviceState = {
    local: {
        files: []
    },
    remote: {
        files: []
    }
};

function mergeUpdate(state, deviceId, after) {
    const before = state.devices[deviceId] || _.cloneDeep(initialDeviceState);
    const newState = _.cloneDeep(state);
    const deviceState = _.merge(before, after);
    newState.devices[deviceId] = deviceState;

    deviceState.plans = {
        download: generateDownloadPlan(Configuration, deviceId, deviceState.local, deviceState.remote),
        upload: generateUploadPlan(Configuration, deviceState.local)
    };

    const downloads = _(newState.devices)
          .map((value, key ) => {
              return value.plans.download.plan;
          })
          .flatten()
          .value();

    const uploads = _(newState.devices)
          .map((value, key ) => {
              return value.plans.upload.plan;
          })
          .flatten()
          .value();

    newState.plans = {
        downloads: downloads,
        uploads: uploads
    };

    return newState;
}

function mergeLocalFiles(state, action) {
    const deviceId = tryParseDeviceIdPath(action.relativePath);
    if (deviceId === null) {
        return state;
    }
    return mergeUpdate(state, deviceId, {
        local: {
            files: action.listing
        }
    });
}

function mergeRemoteFiles(state, action) {
    const key = action.deviceApi.address.key;
    const deviceId = state.map[key];
    if (!_.isString(deviceId)) {
        throw new Error("No such device: " + key);
    }
    return mergeUpdate(state, deviceId, {
        remote: {
            files: action.response.files.files
        }
    });
}

function emptyAllLocalFiles(state) {
    let nextState = state;
    _.values(state.map).forEach(deviceId => {
        nextState = mergeUpdate(nextState, deviceId, {
            local: {
                files: []
            }
        });
    });
    return nextState;
}

export function fileComparisons(state = initialFileComparisonsState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DEVICE_HANDSHAKE_SUCCESS: {
        const key = action.deviceApi.address.key;
        const deviceId = hexArrayBuffer(action.response.capabilities.deviceId);
        if (state.map[key] === deviceId) {
            return nextState;
        }
        nextState = _.cloneDeep(state);
        nextState.map[key] = deviceId;
        return nextState;
    }
    case ActionTypes.LOCAL_FILES_ARCHIVING_ALL: {
        return emptyAllLocalFiles(state);
    }
    case ActionTypes.LOCAL_FILES_DELETING_ALL: {
        return emptyAllLocalFiles(state);
    }
    case ActionTypes.LOCAL_FILES_BROWSE: {
        return mergeLocalFiles(state, action);
    }
    case ActionTypes.DEVICE_FILES_SUCCESS: {
        return mergeRemoteFiles(state, action);
    }
    case ActionTypes.DEVICE_ERASE_FILE_SUCCESS: {
        return mergeRemoteFiles(state, action);
    }
    default:
        return nextState;
    }
}
