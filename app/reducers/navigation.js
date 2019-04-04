import _ from "lodash";

import { NavigationActions } from "react-navigation";

import { AppNavigator } from "../navigators/AppNavigator";
import * as ActionTypes from "../actions/types";

import { pluginManager } from "../services";

import Config from "../config";

const welcomeAction = AppNavigator.router.getActionForPathAndParams(
    Config.welcomeRoute
);
const welcomeState = AppNavigator.router.getStateForAction(welcomeAction);

export function deviceSpecificRoutes(state = { home: { routes: [] } }, action) {
    let nextState = state;
    switch (action.type) {
        case ActionTypes.DEVICE_CAPABILITIES_SUCCESS: {
            const plugins = pluginManager.getActivePlugins(
                action.response.capabilities
            );

            const routesObj = _(plugins)
                .map(p => p.getRoutes())
                .reduce((res, value, key) => {
                    return Object.assign(res, value);
                }, {});

            const routes = _(routesObj)
                .keys()
                .map(k => {
                    return Object.assign({ name: k }, routesObj[k]);
                })
                .map((r, index) => {
                    return {
                        id: index,
                        title: r.title,
                        path: r.path,
                        name: r.name
                    };
                })
                .value();

            return {
                home: {
                    routes: routes
                }
            };
        }
    }
    return state;
}

export function nav(state = welcomeState, action) {
    let nextState = AppNavigator.router.getStateForAction(action, state);

    if (action.params) {
        if (action.params.replace) {
            // In order to replace the previous route we'll remove the item at
            // index - 1 and then decrement the index.
            const { index } = nextState;
            nextState.routes.splice(index - 1, 1);
            nextState.index--;
        } else if (action.params.replaceSame) {
            const { index } = nextState;
            const current = nextState.routes[index];
            const previous = nextState.routes[index - 1];
            if (previous.routeName == current.routeName) {
                nextState.routes.splice(index - 1, 1);
                nextState.index--;
            }
        }
    }

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}
