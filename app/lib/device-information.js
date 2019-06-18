import Promise from 'bluebird';

// import DeviceInfo from "react-native-device-info";

export function getDeviceInformation() {
    return Promise.resolve({
        carrier: null,
        deviceCountry: null,
        deviceId: null,
        deviceName: null,
        manufacturer: null,
        model: null,
        timezone: null,
        uniqueId: null,
        battery: null
    });
    /*
    return DeviceInfo.getBatteryLevel().then(battery => {
        return {
            carrier: DeviceInfo.getCarrier(),
            deviceCountry: DeviceInfo.getDeviceCountry(),
            deviceId: DeviceInfo.getDeviceId(),
            deviceName: DeviceInfo.getDeviceName(),
            manufacturer: DeviceInfo.getManufacturer(),
            model: DeviceInfo.getModel(),
            timezone: DeviceInfo.getTimezone(),
            uniqueId: DeviceInfo.getUniqueID(),
            battery: battery
        };
    });
    */
}
