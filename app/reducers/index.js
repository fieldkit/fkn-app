'use strict';

import { combineReducers } from 'redux'

import * as navigationReducer from './navigation'
import * as authReducer from './auth'
import * as deviceStatusReducer from './device-status'

export default combineReducers(Object.assign(
    navigationReducer,
    authReducer,
    deviceStatusReducer,
));
