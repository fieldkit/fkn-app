import _ from 'lodash';
import * as ActionTypes from '../actions/types';

import { hexArrayBuffer, base64ArrayBuffer } from '../lib/base64';

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

export function fileComparisons(state = initialFileComparisonsState, action) {
    let nextState = state;

    function mergeUpdate(deviceId, after) {
        const before = state.devices[deviceId] || {};
        const newState = _.cloneDeep(state);
        const deviceState = _.merge(before, after);
        newState.devices[deviceId] = deviceState;
        generateDownloadPlan(deviceState.local.files, deviceState.remote);
        return newState;
    }

    function mergeLocalFiles(deviceId, update) {
        return mergeUpdate(deviceId, {
            local: update
        });
    }

    function mergeRemoteFiles(action) {
        const key = action.deviceApi.address.key;
        const deviceId = state.map[key];
        if (!_.isString(deviceId)) {
            throw new Error("No such device: " + key);
        }
        return mergeUpdate(deviceId, {
            remote: { files: action.response.files.files }
        });
    }

    switch (action.type) {
    case ActionTypes.LOCAL_FILES_ARCHIVING_ALL: {
        return _.cloneDeep(state);
    }
    case ActionTypes.LOCAL_FILES_DELETING_ALL: {
        return _.cloneDeep(state);
    }
    case ActionTypes.LOCAL_FILES_BROWSE: {
        const deviceId = tryParseDeviceIdPath(action.relativePath);
        if (deviceId === null) {
            return nextState;
        }
        const update = {
            files: action.listing,
            infos: _(action.listing).map(entry => getFileInformation(entry)).value()
        };
        return mergeLocalFiles(deviceId, update);
    }
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
    case ActionTypes.DEVICE_FILES_SUCCESS: {
        return mergeRemoteFiles(action);
    }
    case ActionTypes.DEVICE_ERASE_FILE_SUCCESS: {
        return mergeRemoteFiles(action);
    }
    default:
        return nextState;
    }
}
