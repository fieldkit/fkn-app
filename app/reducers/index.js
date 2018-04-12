import { combineReducers } from 'redux';

import { pluginManager } from '../services';

import * as navigationReducers from './navigation';
import * as authReducers from './auth';
import * as deviceStatusReducers from './device-status';
import * as dataSetsReducers from './data-sets';
import * as filesReducers from './files';
import * as liveDataReducers from './live-data';
import * as configurationReducers from './configuration';
import * as timersReducers from './timers';
import * as moduleReplyReducers from './modules';
import * as downloadReducers from './download';
import * as progressReducers from './progress';

export default combineReducers(Object.assign(
    navigationReducers,
    authReducers,
    deviceStatusReducers,
    dataSetsReducers,
    filesReducers,
    liveDataReducers,
    configurationReducers,
    timersReducers,
    moduleReplyReducers,
    downloadReducers,
    progressReducers,
    pluginManager.getReducers(),
));
