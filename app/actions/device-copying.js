import _ from 'lodash';

import * as Types from './types';

export function copyFromDevices(devices) {
    return {
        type: Types.COPY_DEVICE_FILES,
        devices: devices
    };
}

