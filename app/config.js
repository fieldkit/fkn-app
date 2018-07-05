if (typeof(__ENV__) == 'undefined') {
    __ENV__ = 'dev';
}

const configs = {
    test: {
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/',
        serviceDiscoveryOnStartup: false,
        findDeviceInterval: 1000,
        findDeviceTimeout: 2 * 1000,
        deviceQueryInterval: 2 * 1000,
        deviceExpireInterval: 5 * 1000,
        pingDeviceInterval: 500,
        deviceFilter: (device) => {
            return true;
        }
    },
    noaa: {
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/',
        serviceDiscoveryOnStartup: false,
        fixedDeviceInfo: {
            address: '192.168.0.136',
            port: 12345,
        },
        findDeviceInterval: 1000,
        findDeviceTimeout: 10 * 1000,
        deviceQueryInterval: 10 * 1000,
        deviceExpireInterval: 21 * 1000,
        pingDeviceInterval: 10 * 1000,
        deviceFilter: (device) => {
            return true;
        }
    },
    dev: {
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/',
        serviceDiscoveryOnStartup: true,
        findDeviceInterval: 1000,
        findDeviceTimeout: 10 * 1000,
        deviceQueryInterval: 10 * 1000,
        deviceExpireInterval: 21 * 1000,
        pingDeviceInterval: 10 * 1000,
        deviceFilter: (device) => {
            return true;
        }
    },
    easyMode: {
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/easy-mode',
        serviceDiscoveryOnStartup: true,
        findDeviceInterval: 1000,
        findDeviceTimeout: 10 * 1000,
        deviceQueryInterval: 10 * 1000,
        deviceExpireInterval: 21 * 1000,
        pingDeviceInterval: 10 * 1000,
        deviceFilter: (device) => {
            return true;
        }
    }
};

export default Config = configs[__ENV__];
