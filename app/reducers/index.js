'use strict';

import { combineReducers } from 'redux'

import * as navigationReducer from './navigation'
import * as authReducer from './auth'
import * as deviceReducer from './device'

export default combineReducers(Object.assign(
    navigationReducer,
    authReducer,
    deviceReducer,
));
