import _ from "lodash";

import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

import { pluginManager } from "./services";

import webApiMiddleware from "./middleware/web-api";
import deviceApiMiddleware from "./middleware/device-api";

import * as Types from "./actions/types";
import { rootSaga } from "./actions/sagas";

const loggerMiddleware = createLogger({
    predicate: (getState, action) => action.type !== Types.FIND_DEVICE_INFO && action.type !== Types.TIMER_TICK && action.type != Types.DEVICE_HANDSHAKE_START && action.type != Types.DEVICE_HANDSHAKE_SUCCESS,
    collapsed: (getState, action) => action.type === Types.FIND_DEVICE_INFO || true,
    _stateTransformer: state => {
        return "state";
    }
});

const sagaMiddleware = createSagaMiddleware();

export function configureStore(reducer, initialState) {
    const enhancer = compose(
        applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
            webApiMiddleware,
            deviceApiMiddleware,
            sagaMiddleware,
            loggerMiddleware
        )
    );
    return createStore(reducer, initialState, enhancer);
}

export function* allSagas() {
    const pluginSagas = pluginManager.getSagas();
    const invoked = _(pluginSagas)
        .concat([rootSaga])
        .map(s => s())
        .value();
    yield all(invoked);
}

export function runSagas() {
    return sagaMiddleware.run(allSagas);
}
