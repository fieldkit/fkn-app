'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

import protobuf from "protobufjs";
import { DataRecord } from '../lib/protocol';

const initialFilesState = { files: null };

export function files(state = initialFilesState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.DEVICE_FILES_SUCCESS:
        return action.response.files;
    default:
        return nextState;
    }
}

