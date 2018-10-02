import _ from 'lodash';

export function selectedDevice(state) {
    if (!state.selectedDevice) {
        return {};
    }

    const device = state.devices[state.selectedDevice.connected.key];

    // console.log('Device', device);

    if (!_.isObject(device) || !_.isObject(device.status)) {
        return {};
    }

    const info = {
        deviceInfo: {
            status: {
                batteryVoltage: device.status.batteryVoltage,
                batteryPercentage: device.status.batteryPercentage,
                uptime: device.status.uptime,
            },
            address: state.selectedDevice.connected.key,
            name: device.capabilities.name
        },
        deviceCapabilities: device.capabilities,
        deviceSpecificRoutes: state.deviceSpecificRoutes,
        deviceConfiguration: {
            network: device.networkSettings || { networks: [] },
        },
        files: {
            files: device.files
        }
    };

    // console.log('Selected', info);

    return info;
}
