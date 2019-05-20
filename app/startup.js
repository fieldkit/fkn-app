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

export function initializeLogging() {
    // NOTE: http://tobyho.com/2012/07/27/taking-over-console-log/
    if (__ENV__ === "test") {
        return;
    }
    const console = window.console;
    if (!console) {
        return;
    }

    function wrap(method) {
        const original = console[method];
        console[method] = function() {
            const args = Array.prototype.slice.apply(arguments);
            let res = "";
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (!arg || typeof arg === "string" || typeof arg === "number") {
                    res += arg;
                } else {
                    res += JSON.stringify(arg);
                }
            }
            if (original.apply) {
                // original.apply(console, [res]);
                original.apply(console, arguments);
            } else {
                // IE
                const message = Array.prototype.slice.apply(arguments).join(" ");
                original(message);
            }
        };
    }

    const methods = ["log", "warn", "error"];
    for (let i = 0; i < methods.length; i++) {
        wrap(methods[i]);
    }
}
