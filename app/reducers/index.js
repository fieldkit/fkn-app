'use strict';

import { combineReducers } from 'redux'

import * as navigationReducers from './navigation'
import * as authReducers from './auth'
import * as deviceStatusReducers from './device-status'
import * as dataSetsReducers from './data-sets'

export default combineReducers(Object.assign(
    navigationReducers,
    authReducers,
    deviceStatusReducers,
    dataSetsReducers,
));
