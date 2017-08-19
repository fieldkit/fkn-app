import { combineReducers } from 'redux'

import * as nothingReducer from './nothing'
import * as navigationReducer from './navigation'

console.log('nav', navigationReducer);

export default combineReducers(Object.assign(
    nothingReducer,
    navigationReducer
));
