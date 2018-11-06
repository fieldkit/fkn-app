import Promise from "bluebird";

import { NativeModules } from 'react-native';

import React from 'react';
import renderer from 'react-test-renderer';

NativeModules.LRDRCTSimpleToast = {
    SHORT: 100
};

NativeModules.RNFSManager = {
};

NativeModules.ServiceDiscovery = {
    addListener: (ev, listener) => {
    },
    start: () => {
    }
};

NativeModules.WifiManager = {
    getCurrentWifiSSID: () => {
        return new Promise(() => {
        });
    }
};
