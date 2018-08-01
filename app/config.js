if (typeof(__ENV__) == 'undefined') {
    __ENV__ = process.env['FIELDKIT_ENV'] || 'dev';
}

const build = {
    gitCommit: process.env['GIT_COMMIT'],
    gitBranch: process.env['GIT_BRANCH'],
    buildJobName: process.env['JOB_NAME'],
    buildJobBaseName: process.env['JOB_BASE_NAME'],
    buildTime: process.env['BUILD_TIMESTAMP'],
    buildTag: process.env['BUILD_TAG'],
    buildNumber: process.env['BUILD_NUMBER']
};

const configs = {
    test: {
        build: build,
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/',
        serviceDiscoveryOnStartup: false,
        discoveryQueryFilesAndStatus: false,
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
        build: build,
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/',
        serviceDiscoveryOnStartup: false,
        discoveryQueryFilesAndStatus: false,
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
        build: build,
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/',
        serviceDiscoveryOnStartup: true,
        discoveryQueryFilesAndStatus: true,
        findDeviceInterval: 1000,
        findDeviceTimeout: 10 * 1000,
        deviceQueryInterval: 10 * 1000,
        deviceExpireInterval: 21 * 1000,
        pingDeviceInterval: 10 * 1000,
        deviceFilter: (device) => {
            return true;
        }
    },
    release: {
        build: build,
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/',
        serviceDiscoveryOnStartup: true,
        discoveryQueryFilesAndStatus: false,
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
        build: build,
        baseUri: 'http://api.fkdev.org',
        welcomeRoute: '/easy-mode',
        serviceDiscoveryOnStartup: true,
        discoveryQueryFilesAndStatus: true,
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
