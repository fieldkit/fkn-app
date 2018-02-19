'use strict';

import _ from 'lodash';
import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { Platform } from 'react-native';
import dgram from 'react-native-udp';

import ServiceDiscovery from "react-native-service-discovery";
import { createChannel } from './channels';
import * as Types from './types';

import { unixNow } from '../lib/helpers';

import Config from '../config';

function createServiceDiscoveryChannel() {
    const channel = createChannel();

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
            yield delay(500);
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

export function* serviceDiscovery() {
    yield call(monitorServiceDiscoveryEvents, createServiceDiscoveryChannel());
}
