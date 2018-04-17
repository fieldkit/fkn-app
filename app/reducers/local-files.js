import _ from 'lodash';
import * as ActionTypes from '../actions/types';

const initialLocalFilesState = { listings: {} };

export function localFiles(state = initialLocalFilesState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.LOCAL_FILES_BROWSE: {
        nextState = _.clone(state);
        nextState.listings[action.relativePath] = action.listing;
        return nextState;
    }
    default:
        return nextState;
    }
}
