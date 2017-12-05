if (typeof(__ENV__) == 'undefined') {
    __ENV__ = 'dev';
}

const configs = {
    test: {
        serviceDiscoveryOnStartup: false,
        findDeviceTimeout: 2 * 1000,
        pingDeviceInterval: 500,
    },
    dev: {
        serviceDiscoveryOnStartup: true,
        findDeviceTimeout: 60 * 1000,
        pingDeviceInterval: 20 * 1000,
    }
};

export default Config = configs[__ENV__];
