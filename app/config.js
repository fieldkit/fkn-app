if (typeof(__ENV__) == 'undefined') {
    __ENV__ = 'dev';
}

const configs = {
    test: {
        serviceDiscoveryOnStartup: false,
        findDeviceTimeout: 2 * 1000,
        deviceQueryInterval: 2 * 1000,
        pingDeviceInterval: 500,
    },
    noaa: {
        serviceDiscoveryOnStartup: false,
        fixedDeviceInfo: {
            address: '192.168.0.136',
            port: 12345,
        },
        findDeviceTimeout: 10 * 1000,
        deviceQueryInterval: 10 * 1000,
        pingDeviceInterval: 20 * 1000,
    },
    dev: {
        serviceDiscoveryOnStartup: true,
        findDeviceTimeout: 10 * 1000,
        deviceQueryInterval: 10 * 1000,
        pingDeviceInterval: 20 * 1000,
    }
};

export default Config = configs[__ENV__];
