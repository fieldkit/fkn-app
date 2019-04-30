import _ from "lodash";

import * as ActionTypes from "../actions/types";

const initialProgressState = {
    depth: 0,
    operations: [],
    task: {
        done: true
    },
    upload: {
        done: true
    },
    download: {
        done: true
    }
};

export function progress(state = initialProgressState, action) {
    let nextState = state;

    const api = action.deviceApi;
    if (_.isObject(api)) {
        if (api.blocking) {
            nextState = _.clone(state);
            if (api.pending) {
                nextState.depth++;
            } else {
                nextState.depth--;
            }
        }
    }

    switch (action.type) {
        case ActionTypes.TASK_START: {
            return {
                ...nextState,
                ...{ task: { cancelable: true, done: false, progress: 0 } }
            };
        }
        case ActionTypes.TASK_PROGRESS: {
            return { ...nextState, ...{ task: action.task } };
        }
        case ActionTypes.TASK_DONE: {
            return { ...nextState, ...{ task: action.task } };
        }
        case ActionTypes.UPLOAD_FILE_START: {
            return {
                ...nextState,
                ...{ upload: { cancelable: true, done: false, progress: 0 } }
            };
        }
        case ActionTypes.UPLOAD_FILE_PROGRESS: {
            return { ...nextState, ...{ upload: action.upload } };
        }
        case ActionTypes.UPLOAD_FILE_DONE: {
            return { ...nextState, ...{ upload: action.upload } };
        }
        case ActionTypes.DOWNLOAD_FILE_START: {
            return {
                ...nextState,
                ...{ download: { cancelable: true, done: false, progress: 0 } }
            };
        }
        case ActionTypes.DOWNLOAD_FILE_PROGRESS: {
            return { ...nextState, ...{ download: action.download } };
        }
        case ActionTypes.DOWNLOAD_FILE_DONE: {
            return { ...nextState, ...{ download: action.download } };
        }
        case ActionTypes.OPERATION_CANCEL: {
            return { ...nextState, ...{ download: { done: true } } };
        }
        default:
            return nextState;
    }
}
