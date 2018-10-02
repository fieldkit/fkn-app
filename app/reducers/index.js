import { combineReducers } from 'redux';

import { pluginManager } from '../services';

import * as navigationReducers from './navigation';
import * as authReducers from './auth';
import * as deviceStatusReducers from './device-status';
import * as liveDataReducers from './live-data';
import * as networkConfigurationReducers from './network';
import * as timersReducers from './timers';
import * as moduleReplyReducers from './modules';
import * as downloadReducers from './download';
import * as progressReducers from './progress';
import * as localFilesReducers from './local-files';
import * as planningReducers from './planning';
import * as easyModeReducers from './easy-mode';

export default combineReducers(Object.assign(
    navigationReducers,
    authReducers,
    deviceStatusReducers,
    liveDataReducers,
    networkConfigurationReducers,
    timersReducers,
    moduleReplyReducers,
    downloadReducers,
    progressReducers,
    localFilesReducers,
    planningReducers,
    easyModeReducers,
    pluginManager.getReducers(),
));
