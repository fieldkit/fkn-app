import _ from 'lodash';

import * as ActionTypes from '../actions/types';

export function download(state = {}, action) {
    let nextState = state;

    switch (action.type) {
        case ActionTypes.DOWNLOAD_FILE_START: {
            return { ...nextState, ...action.download };
        }
        case ActionTypes.DOWNLOAD_FILE_PROGRESS: {
            return { ...nextState, ...action.download };
        }
        case ActionTypes.DOWNLOAD_FILE_DONE: {
            return { ...nextState, ...action.download };
        }
        default:
            return nextState;
    }
}
