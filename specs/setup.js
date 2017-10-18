import {
    NativeModules,
} from 'react-native';

import React from 'react';
import renderer from 'react-test-renderer';

NativeModules.RNFSManager = {
}

NativeModules.ServiceDiscovery = {
    addListener: (ev, listener) => {
    },
    start: () => {
    }
}
