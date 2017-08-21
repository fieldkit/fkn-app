import * as ActionTypes from './types';

export function navigateWelcome() {
    return {
        type: ActionTypes.NAVIGATION_WELCOME,
    };
}

export function navigateAbout() {
    return {
        type: ActionTypes.NAVIGATION_ABOUT,
    };
}
