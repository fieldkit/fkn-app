import _ from "lodash";
import * as ActionTypes from "../actions/types";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

import { generateDownloadPlan, generateUploadPlan } from "./synchronizing";

function tryParseDeviceIdPath(path) {
    // Example: 0004a30b001cc468
    const re = /([0-9a-fA-F]{16})/;
    const match = path.replace("/", "").match(re);
    if (match === null) {
        return null;
    }
    return match[1];
}

function isStagingPath(path) {
    return path.match(/.staging/);
}

function isArchivePath(path) {
    return path.match(/archive/);
}

export const Configuration = [
    {
        fileId: 4,
        chunked: 0,
        offset: 0,
        length: 0,
        delete: false,
        condition: (file, others) => true
    },
    {
        fileId: 2,
        chunked: 0,
        offset: 0,
        length: 0,
        delete: true,
        condition: (file, others) => {
            return _(others)
                .filter(f => (f.id == 3 && Number(f.size) == 0) || Number(f.size) > file.size)
                .some();
        }
    },
    {
        fileId: 3,
        chunked: 0,
        offset: 0,
        length: 0,
        delete: true,
        condition: (file, others) => {
            return _(others)
                .filter(f => (f.id == 2 && Number(f.size) == 0) || Number(f.size) > file.size)
                .some();
        }
    }
];

const initialDeviceState = {
    local: {
        files: []
    },
    remote: {
        files: []
    }
};

function mergeUpdate(state, deviceId, after) {
    const newState = _.cloneDeep(state);
    const deviceBefore = newState.devices[deviceId] || _.cloneDeep(initialDeviceState);
    const jsonBefore = JSON.stringify({ local: deviceBefore.local, remote: deviceBefore.remote });
    const deviceAfter = _.assign(deviceBefore, after);
    newState.devices[deviceId] = deviceAfter;

    const jsonAfter = JSON.stringify({ local: deviceAfter.local, remote: deviceAfter.remote });
    if (jsonBefore != jsonAfter) {
        console.groupCollapsed("Generating New Plans");
        console.log(jsonAfter);
        console.groupEnd();
    }

    deviceAfter.plans = {
        download: generateDownloadPlan(Configuration, deviceAfter.local, deviceAfter.remote),
        upload: generateUploadPlan(Configuration, deviceAfter.local)
    };

    const downloads = _(newState.devices)
        .map((value, key) => value.plans.download)
        .value();

    const uploads = _(newState.devices)
        .map((value, key) => value.plans.upload)
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
    if (isStagingPath(action.relativePath)) {
        return state;
    }
    if (isArchivePath(action.relativePath)) {
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
        console.log("No such device: " + key);
        return state;
    }
    return mergeUpdate(state, deviceId, {
        remote: {
            deviceId: deviceId,
            address: action.deviceApi.address,
            files: action.response.files.files
        }
    });
}

function mergeDeviceAway(state, address) {
    const key = address.key;
    const deviceId = state.map[key];
    if (!_.isString(deviceId)) {
        console.log("Noop");
        return state;
    }
    const nextState = mergeUpdate(state, deviceId, {
        remote: {
            deviceId: deviceId,
            address: address,
            files: []
        }
    });

    delete nextState.devices[deviceId];
    delete nextState.map[key];

    console.log("Merged device away");
    return nextState;
}

function emptyAllLocalFiles(state) {
    let nextState = _.cloneDeep(state);
    _.keys(state.devices).forEach(deviceId => {
        nextState = mergeUpdate(nextState, deviceId, {
            local: {
                files: []
            }
        });
    });
    return nextState;
}

const initialPlanningState = {
    map: {},
    devices: {},
    plans: {
        download: [],
        upload: []
    }
};

export function planning(state = initialPlanningState, action) {
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
        case ActionTypes.FIND_DEVICE_LOST: {
            return mergeDeviceAway(state, action.address);
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
