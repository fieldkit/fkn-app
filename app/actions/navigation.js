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

export function navigateDataSets() {
    return {
        type: Types.NAVIGATION_DATA_SETS,
    };
}

export function navigateLiveData() {
    return {
        type: Types.NAVIGATION_LIVE_DATA,
    };
}

export function navigateViewDataSet(id) {
    return {
        type: Types.NAVIGATION_VIEW_DATA_SET,
        params: {
            id
        }
    };
}

export function navigateBack() {
    return {
        type: Types.NAVIGATION_BACK,
    };
}
