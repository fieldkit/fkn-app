'use strict'

import _ from 'lodash';
import { put, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import ServiceDiscovery from "react-native-service-discovery";
import { createChannel } from './channels';
import * as Types from './types';

import Config from '../config';

function createServiceDiscoveryChannel() {
    const channel = createChannel();
    const serviceDiscovery = new ServiceDiscovery();

    serviceDiscovery.on('service-resolved', (ev) => {
    });

    serviceDiscovery.on('udp-discovery', (ev) => {
        channel.put(findDeviceInfo(ev.address, ev.port));
    });

    serviceDiscovery.start(54321);

    return channel;
}

function* monitorServiceDiscoveryEvents(channel) {
    if (Config.serviceDiscoveryOnStartup) {
        while (true) {
            const info = yield call(channel.take)
            yield put(info);
            yield delay(1000);
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
            valid: port > 0
        }
    };
}

export function* serviceDiscovery() {
    yield call(monitorServiceDiscoveryEvents, createServiceDiscoveryChannel());
}
