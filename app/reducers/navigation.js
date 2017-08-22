'use strict';

import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';
import * as ActionTypes from '../actions/types';

const firstAction = AppNavigator.router.getActionForPathAndParams('/');
const initialState = AppNavigator.router.getStateForAction(
    AppNavigator.router.getStateForAction(firstAction),
);

export function nav(state = initialState, action) {
    let nextState;
    switch (action.type) {
    case ActionTypes.NAVIGATION_WELCOME:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.reset({
                index: 0,
                actions: [firstAction]
            }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_CONNECTING:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'Connecting' }),
            state
        );
        break;
    case ActionTypes.NAVIGATION_DEVICE_MENU:
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'DeviceMenu' }),
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
