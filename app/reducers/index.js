import { combineReducers } from 'redux';

import * as nothingReducer from './nothing';

export default combineReducers(Object.assign(nothingReducer));
