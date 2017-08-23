'use strict';

import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';
import * as ActionTypes from '../actions/types';

const welcomeAction = AppNavigator.router.getActionForPathAndParams('/');
const welcomeState = AppNavigator.router.getStateForAction(
    AppNavigator.router.getStateForAction(welcomeAction)
);

const connectingAction = AppNavigator.router.getActionForPathAndParams('/connecting');
const deviceMenuAction = AppNavigator.router.getActionForPathAndParams('/device');

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
    case ActionTypes.NAVIGATION_ABOUT:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'About' }),
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
