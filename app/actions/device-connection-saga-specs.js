import 'react-native';

import SagaTester from 'redux-saga-tester';
import Promise from "bluebird";

import * as Types from './types';
import { findDeviceInfo } from './discovery';
import { discoverDevices, pingConnectedDevice } from './sagas';
import { useFakeDeviceConnection } from '../middleware/device-api';
import { QueryType, ReplyType } from '../lib/protocol';

describe('device connection saga', () => {
    let tester;
    let fakeDevice;

    beforeEach(() => {
        fakeDevice = useFakeDeviceConnection();
        tester = new SagaTester({
            initialState: {
                devices: { },
                deviceStatus: {
                    addresses: { },
                    connected: null,
                    api: {
                        pending: false
                    }
                }
            }
        });
    });

    describe('discovery', () => {
        let task;

        beforeEach(() => {
            task = tester.start(discoverDevices);
        });

        it.skip('should timeout and fail after timeout interval', async () => {
            await tester.waitFor(Types.FIND_DEVICE_FAIL);
        });

        it.skip('should timeout and fail when discovery returns invalid addresses', async () => {
            tester.dispatch(findDeviceInfo('127.0.0.1', 0));
            await tester.waitFor(Types.FIND_DEVICE_FAIL);
        });

        it('should query the device for capabilities and return success', async () => {
            fakeDevice.push({}, {
                type: ReplyType.values.REPLY_CAPABILITIES,
                response: { capabilities: { } }
            })
            tester.dispatch(findDeviceInfo('127.0.0.1', 12345));
            await tester.waitFor(Types.FIND_DEVICE_SUCCESS);
            expect(fakeDevice.queue).toHaveLength(0);
        });

        afterEach(() => {
            task.cancel();
        });
    });

    describe('pinging', () => {
        let task;

        beforeEach(() => {
            task = tester.start(pingConnectedDevice);
        });

        afterEach(() => {
            // Cancel to keep from interfering with the following test.
            task.cancel();
        });

        it('should ping after selecting device', () => {
            tester.getState().deviceStatus.connected = {};

            fakeDevice.push({}, {
                type: ReplyType.values.REPLY_CAPABILITIES,
                response: { capabilities: { } }
            });

            tester.dispatch({
                type: Types.FIND_DEVICE_SELECT,
                address: {}
            });

            return Promise.delay(Config.pingDeviceInterval + 100).then(() => {
                expect(fakeDevice.queue).toHaveLength(0);
            });
        });

        it('should ping after a previous ping', () => {
            tester.getState().deviceStatus.connected = {};

            fakeDevice.push({}, {
                type: ReplyType.values.REPLY_CAPABILITIES,
                response: { capabilities: { } }
            });

            tester.dispatch({
                type: Types.DEVICE_PING_SUCCESS,
                address: {}
            });

            return Promise.delay(Config.pingDeviceInterval + 100).then(() => {
                expect(fakeDevice.queue).toHaveLength(0);
            });
        });

        it('should dispatch FIND_DEVICE_LOST when ping fails', async () => {
            tester.getState().deviceStatus.connected = {};

            fakeDevice.pushError({}, "No reply");

            tester.dispatch({
                type: Types.FIND_DEVICE_SELECT,
                address: {}
            });

            await tester.waitFor(Types.FIND_DEVICE_LOST);
        });
    });
});
