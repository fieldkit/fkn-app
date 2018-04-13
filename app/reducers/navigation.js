import _ from 'lodash';

import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';
import * as ActionTypes from '../actions/types';

import { pluginManager } from '../services';

const welcomeAction = AppNavigator.router.getActionForPathAndParams('/');
const welcomeState = AppNavigator.router.getStateForAction(
    AppNavigator.router.getStateForAction(welcomeAction)
);
const connectingAction = AppNavigator.router.getActionForPathAndParams('/connecting');
const deviceMenuAction = AppNavigator.router.getActionForPathAndParams('/device');

export function deviceSpecificRoutes(state = { home: { routes: [] } }, action) {
    let nextState = state;
    switch (action.type) {
    case ActionTypes.DEVICE_CAPABILITIES_SUCCESS: {
        const plugins = pluginManager.getActivePlugins(action.response.capabilities);

        const routesObj = _(plugins).map(p => p.getRoutes()).reduce((res, value, key) => {
            return Object.assign(res, value);
        }, {});

        const routes = _(routesObj).keys().map((k) => {
            return Object.assign({ name: k }, routesObj[k]);
        }).map((r, index) => {
            return {
                id: index,
                title: r.title,
                path: r.path,
                name: r.name,
            };
        }).value();

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
    let nextState;
    switch (action.type) {
    case ActionTypes.NAVIGATION_WELCOME:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.reset({
                index: 0,
                actions: [welcomeAction]
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_CONNECTING:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Connecting',
                        params: {
                            connecting: true
                        }
                    })
                ]
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_DEVICE_MENU:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'DeviceMenu',
                        params: {
                            connectionRequired: true
                        }
                    })
                ]
            }),
            state
        );
        break;
        case ActionTypes.NAVIGATION_FILES:
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({
                    routeName: 'Files',
                    params: { connectionRequired: true }
                }),
                state
            );
            break;
    case ActionTypes.NAVIGATION_DATA_SETS:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: 'DataSets',
                params: { connectionRequired: true }
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_CONFIGURE:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: 'Configure',
                params: { connectionRequired: true }
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_BROWSER:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: 'Browser'
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_NETWORK:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: 'Network',
                params: { connectionRequired: true }
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_SENSORS:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: 'Sensors',
                params: { connectionRequired: true }
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_LIVE_DATA:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: 'LiveData',
                params: { connectionRequired: true }
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_VIEW_DATA_SET:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({
                routeName: 'DataSet',
                params: Object.assign({ connectionRequired: true }, action.params)
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_NAME_OR_PATH:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: action.name }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_ABOUT:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'About' }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_BACK:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.back(),
            state
        );
        break;
    default:
        nextState = AppNavigator.router.getStateForAction(action, state);
        break;
    }

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}
