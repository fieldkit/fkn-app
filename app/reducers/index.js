import { combineReducers } from 'redux'

import * as nothingReducer from './nothing'
import * as navigationReducer from './navigation'
import * as authReducer from './auth'

export default combineReducers(Object.assign(
    nothingReducer,
    navigationReducer,
    authReducer,
));
