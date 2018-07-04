import _ from 'lodash';
import { all, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { Platform } from 'react-native';
import dgram from 'react-native-udp';

import WifiManager from 'react-native-wifi';

import ServiceDiscovery from "react-native-service-discovery";

import { unixNow } from '../../lib/helpers';
import Config from '../../config';

import * as Types from '../types';

import { createChannel } from './channels';

function createServiceDiscoveryChannel() {
    const channel = createChannel('SD');

    // This is no longer being used, though may come back. I wanted to keep
    // creating this just to avoid regressions.
    const serviceDiscovery = new ServiceDiscovery();

    serviceDiscovery.on('service-resolved', (ev) => {
    });

    serviceDiscovery.on('udp-discovery', (ev) => {
        channel.put(findDeviceInfo(ev.address, ev.port));
    });

    const port = 54321;

    if (__ENV__ !== 'test') {
        // serviceDiscovery.start(port);

        const socket = dgram.createSocket("udp4");
        socket.bind(port);
        socket.on('message', (data, remoteInfo) => {
            channel.put(findDeviceInfo(remoteInfo.address, remoteInfo.port));
        });
    }

    return channel;
}

function* monitorServiceDiscoveryEvents(channel) {
    if (Config.serviceDiscoveryOnStartup) {
        while (true) {
            const info = yield call(channel.take);
            yield put(info);
        }
    } else if (Config.fixedDeviceInfo) {
        while (true) {
            yield put(findDeviceInfo(Config.fixedDeviceInfo.address, Config.fixedDeviceInfo.port));
            yield delay(1000);
        }
    }
}

export function findDeviceInfo(host, port) {
    return {
        type: Types.FIND_DEVICE_INFO,
        address: {
            host: host,
            port: port,
            key: host,
            valid: port > 0
        }
    };
}

export function wifiSsidChanged(ssid) {
    return {
        type: Types.WIFI_SSID_CHANGED,
        ssid: ssid
    };
}

function* monitorWifi() {
    const channel = createChannel('Wifi');

    let currentSsid = null;
    while (true) {
        WifiManager.getCurrentWifiSSID().then((ssid) => {
            channel.put(ssid);
        });

        const ssid = yield call(channel.take);
        if (currentSsid != ssid) {
            yield put(wifiSsidChanged(ssid));
            currentSsid = ssid;
        }

        yield delay(1000);
    }
}

export function* serviceDiscovery() {
    yield all([
        call(monitorServiceDiscoveryEvents, createServiceDiscoveryChannel()),
        monitorWifi()
    ]);
}
