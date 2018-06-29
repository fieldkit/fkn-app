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

export function navigateSensors() {
    return {
        type: Types.NAVIGATION_SENSORS,
    };
}

export function navigateAbout() {
    return {
        type: Types.NAVIGATION_ABOUT,
    };
}

export function navigateFiles() {
    return {
        type: Types.NAVIGATION_FILES,
    };
}

export function navigateConfigure() {
    return {
        type: Types.NAVIGATION_CONFIGURE,
    };
}

export function navigatePath(path) {
    return {
        type: Types.NAVIGATION_NAME_OR_PATH,
        name: path,
    };
}

export function navigateName(name) {
    return {
        type: Types.NAVIGATION_NAME_OR_PATH,
        name: name,
    };
}

export function navigateNetwork() {
    return {
        type: Types.NAVIGATION_NETWORK,
    };
}

export function navigateBrowser(path) {
    return {
        type: Types.NAVIGATION_BROWSER,
        path: path || '/'
    };
}

export function navigateLiveData() {
    return {
        type: Types.NAVIGATION_LIVE_DATA,
    };
}

export function navigateBack() {
    return {
        type: Types.NAVIGATION_BACK,
    };
}
