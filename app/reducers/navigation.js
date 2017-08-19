import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Welcome');

// const tempNavState = ;
// const secondAction = AppNavigator.router.getActionForPathAndParams('About');

const initialState = AppNavigator.router.getStateForAction(
    AppNavigator.router.getStateForAction(firstAction),
);

export function nav(state = initialState, action) {
    let nextState;
    switch (action.type) {
    case 'Welcome':
        nextState = AppNavigator.router.getStateForAction(
            NavigationActions.back(),
            state
        );
        break;
    case 'About':
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

/*
const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
    switch (action.type) {
    case 'Login':
        return { ...state, isLoggedIn: true };
    case 'Logout':
        return { ...state, isLoggedIn: false };
    default:
        return state;
    }
}

const AppReducer = combineReducers({
    nav,
    auth,
});

export default AppReducer;
*/
