import _ from 'lodash';
import * as ActionTypes from '../actions/types';

const initialLocalFilesState = {
    listings: {},
    records: {}
};

export function localFiles(state = initialLocalFilesState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.LOCAL_FILES_ARCHIVING_ALL: {
        return _.cloneDeep(initialLocalFilesState);
    }
    case ActionTypes.LOCAL_FILES_DELETING_ALL: {
        return _.cloneDeep(initialLocalFilesState);
    }
    case ActionTypes.LOCAL_FILES_FINDING_ALL: {
        return _.cloneDeep(initialLocalFilesState);
    }
    case ActionTypes.LOCAL_FILES_BROWSE: {
        nextState = _.cloneDeep(state);
        nextState.listings[action.relativePath] = action.listing;
        return nextState;
    }
    case ActionTypes.LOCAL_FILES_RECORDS: {
        nextState = _.cloneDeep(state);
        nextState.records[action.relativePath] = { records: action.records };
        return nextState;
    }
    default:
        return nextState;
    }
}
