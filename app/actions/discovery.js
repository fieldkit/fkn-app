'use strict'

import _ from 'lodash';
import { put, call } from 'redux-saga/effects'

import ServiceDiscovery from "react-native-service-discovery";
import { createChannel } from './channels';
import * as Types from './types';

function createServiceDiscoveryChannel() {
    const channel = createChannel();
    const serviceDiscovery = new ServiceDiscovery();

    serviceDiscovery.on('service-resolved', (ev) => {
    });

    serviceDiscovery.on('udp-discovery', (ev) => {
        channel.put(findDeviceInfo(ev.address, ev.port));
    });

    serviceDiscovery.start();

    return channel;
}

function* monitorServiceDiscoveryEvents(channel) {
    let lastInfo = null;
    while (true) {
        const info = yield call(channel.take)
        yield put(info);
        lastInfo = info;
    }
}

export function findDeviceInfo(host, port) {
    return {
        type: Types.FIND_DEVICE_INFO,
        address: {
            host: host,
            port: port,
            valid: port > 0
        }
    };
}

export function* serviceDiscovery() {
    yield call(monitorServiceDiscoveryEvents, createServiceDiscoveryChannel());
}
