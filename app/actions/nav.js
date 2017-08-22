'use strict';

import * as Types from './types';

export function navigateWelcome() {
    return {
        type: Types.NAVIGATION_WELCOME,
    };
}

export function navigateConnecting() {
    return {
        type: Types.NAVIGATION_CONNECTING,
    };
}

export function navigateDeviceMenu() {
    return {
        type: Types.NAVIGATION_DEVICE_MENU,
    };
}

export function navigateAbout() {
    return {
        type: Types.NAVIGATION_ABOUT,
    };
}
