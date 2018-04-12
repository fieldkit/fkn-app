import _ from 'lodash';

import * as ActionTypes from '../actions/types';

const initialProgressState = {
    depth: 0,
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
            }
            else {
                nextState.depth--;
            }
        }
    }

    switch (action.type) {
    case ActionTypes.DOWNLOAD_FILE_START: {
        return { ...nextState, ...{ download: { done: false, progress: 0 } } };
    }
    case ActionTypes.DOWNLOAD_FILE_PROGRESS: {
        return { ...nextState, ...{ download: action.download } };
    }
    case ActionTypes.DOWNLOAD_FILE_DONE: {
        return { ...nextState, ...{ download: action.download } };
    }
    default:
        return nextState;
    }
}

