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
        const address = {
            host: ev.address,
            port: ev.port,
            valid: true
        };
        channel.put({
            type: Types.FIND_DEVICE_INFO,
            address: address
        });
    });

    serviceDiscovery.start();

    return channel;
}

function* monitorServiceDiscoveryEvents(channel) {
    let lastInfo = null;
    while (true) {
        const info = yield call(channel.take)
        if (lastInfo == null || !_.isEqual(lastInfo, info)) {
            yield put(info);
        }
        lastInfo = info;
    }
}

export function* serviceDiscovery() {
    yield call(monitorServiceDiscoveryEvents, createServiceDiscoveryChannel());
}
