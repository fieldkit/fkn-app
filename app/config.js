if (typeof(__ENV__) == 'undefined') {
    __ENV__ = 'dev';
}

const configs = {
    test: {
        serviceDiscoveryOnStartup: false,
        findDeviceInterval: 1000,
        findDeviceTimeout: 2 * 1000,
        deviceQueryInterval: 2 * 1000,
        deviceExpireInterval: 5 * 1000,
        pingDeviceInterval: 500,
    },
    noaa: {
        serviceDiscoveryOnStartup: false,
        fixedDeviceInfo: {
            address: '192.168.0.136',
            port: 12345,
        },
        findDeviceInterval: 1000,
        findDeviceTimeout: 10 * 1000,
        deviceQueryInterval: 10 * 1000,
        deviceExpireInterval: 15 * 1000,
        pingDeviceInterval: 10 * 1000,
    },
    dev: {
        serviceDiscoveryOnStartup: true,
        findDeviceInterval: 1000,
        findDeviceTimeout: 10 * 1000,
        deviceQueryInterval: 10 * 1000,
        deviceExpireInterval: 15 * 1000,
        pingDeviceInterval: 10 * 1000,
    }
};

export default Config = configs[__ENV__];
