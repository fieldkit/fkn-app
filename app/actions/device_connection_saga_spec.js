import 'react-native';

import SagaTester from 'redux-saga-tester';
import Promise from "bluebird";

import * as Types from './types';
import { findDeviceInfo } from './discovery';
import { discoverDevice, pingDevice } from './sagas';
import { useFakeDeviceConnection } from '../middleware/device-api';
import { QueryType, ReplyType } from '../lib/protocol';

describe('device connection saga', () => {
    let tester;
    let fakeDevice;

    beforeEach(() => {
        fakeDevice = useFakeDeviceConnection();
        tester = new SagaTester({
            initialState: {
                deviceStatus: {
                    api: {
                        pending: false
                    }
                }
            }
        });
    });

    describe('discovery', () => {
        beforeEach(() => {
            tester.start(discoverDevice);
        });

        it('should timeout and fail after 60s', async () => {
            await tester.waitFor(Types.FIND_DEVICE_FAIL);
        });

        it('should timeout and fail when discovery returns invalid addresses', async () => {
            tester.dispatch(findDeviceInfo('127.0.0.1', 0));
            await tester.waitFor(Types.FIND_DEVICE_FAIL);
        });

        it('should query the device for capabilities and return success', async () => {
            fakeDevice.push({}, {
                type: ReplyType.values.REPLY_CAPABILITIES
            })
            tester.dispatch(findDeviceInfo('127.0.0.1', 12345));
            await tester.waitFor(Types.FIND_DEVICE_SUCCESS);
            expect(fakeDevice.queue).toHaveLength(0);
        });
    });

    describe('pinging', () => {
        let task;

        beforeEach(() => {
            task = tester.start(pingDevice);
        });

        afterEach(() => {
            // Cancel to keep from interfering with the following test.
            task.cancel();
        });

        it('should ping after finding device', () => {
            fakeDevice.push({}, {
                type: ReplyType.values.REPLY_CAPABILITIES
            });

            tester.dispatch({
                type: Types.FIND_DEVICE_SUCCESS
            });

            return Promise.delay(Config.pingDeviceInterval + 100).then(() => {
                expect(fakeDevice.queue).toHaveLength(0);
            });
        });

        it('should ping after a previous ping', () => {
            fakeDevice.push({}, {
                type: ReplyType.values.REPLY_CAPABILITIES
            });

            tester.dispatch({
                type: Types.DEVICE_PING_SUCCESS
            });

            return Promise.delay(Config.pingDeviceInterval + 100).then(() => {
                expect(fakeDevice.queue).toHaveLength(0);
            });
        });
    });
});
