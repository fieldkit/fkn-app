'use strict';

import { combineReducers } from 'redux';

import * as navigationReducers from './navigation';
import * as authReducers from './auth';
import * as deviceStatusReducers from './device-status';
import * as dataSetsReducers from './data-sets';
import * as liveDataReducers from './live-data';
import * as configurationReducers from './configuration';
import * as timersReducers from './timers';

import { pluginManager } from '../services';

export default combineReducers(Object.assign(
    navigationReducers,
    authReducers,
    deviceStatusReducers,
    dataSetsReducers,
    liveDataReducers,
    configurationReducers,
    timersReducers,
    pluginManager.getReducers(),
));
