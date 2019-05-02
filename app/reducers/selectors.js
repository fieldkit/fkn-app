import _ from "lodash";

const emptySelectedDevice = {
    deviceInfo: {},
    deviceCapabilities: {},
    deviceSpecificRoutes: {
        home: {
            routes: []
        }
    },
    deviceConfiguration: {
        network: { networks: [] }
    },
    files: {
        files: {
            files: []
        }
    }
};

export function selectedDevice(state) {
    if (!_.isObject(state.selectedDevice) || !_.isObject(state.selectedDevice.connected)) {
        console.log("No selected device");
        return emptySelectedDevice;
    }

    const device = state.devices[state.selectedDevice.connected.key];
    if (!_.isObject(device) || !_.isObject(device.status)) {
        console.log("No device");
        return emptySelectedDevice;
    }

    const info = {
        deviceInfo: {
            status: {
                batteryVoltage: device.status.batteryVoltage,
                batteryPercentage: device.status.batteryPercentage,
                uptime: device.status.uptime
            },
            address: state.selectedDevice.connected.key,
            name: device.capabilities.name
        },
        deviceCapabilities: device.capabilities,
        deviceSpecificRoutes: state.deviceSpecificRoutes,
        deviceConfiguration: {
            network: device.networkSettings || { networks: [] }
        },
        files: {
            files: device.files
        }
    };

    return info;
}
