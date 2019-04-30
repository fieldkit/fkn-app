import DeviceInfo from "react-native-device-info";

export function getDeviceInformation() {
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
}
