import * as ActionTypes from './types';
import { CALL_DEVICE_API } from '../middleware/device-api';

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

export function deviceHello() {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_DEVICE_API]: {
                types: [ActionTypes.DEVICE_SAY_HELLO_START, ActionTypes.DEVICE_SAY_HELLO_SUCCESS, ActionTypes.DEVICE_SAY_HELLO_FAILED],
                call: (api) => api.sayHello({ name: 'Jacob' }),
            },
        });
    };
}
