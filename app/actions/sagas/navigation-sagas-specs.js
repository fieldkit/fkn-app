import 'react-native';

import SagaTester from 'redux-saga-tester';
import Promise from "bluebird";

import { Alert } from 'react-native';

import { useFakeDeviceConnection } from '../../middleware/device-api';
import { QueryType, ReplyType } from '../../lib/protocol';

import * as Types from '../types';
import { navigateConnecting, navigateDeviceMenu, navigateWelcome } from '../navigation';

import { findDeviceInfo } from './discovery';
import { connectionRelatedNavigation } from './sagas';

describe('device connection navigation', () => {
    let tester;
    let fakeDevice;
    let task;

    beforeEach(() => {
        fakeDevice = useFakeDeviceConnection();
        tester = new SagaTester({
            initialState: {
                devices: { },
                deviceStatus: {
                    connected: null
                },
                nav: {
                    index: 0,
                    routes: [{
                        params: {}
                    }]
                }
            },
        });

        task = tester.start(connectionRelatedNavigation);
    });

    afterEach(() => {
        task.cancel();
    });

    it('should navigate nowhere on WelcomeScreen after FIND_DEVICE_SUCCESS', () => {
        const findDeviceSuccess = {
            type: Types.FIND_DEVICE_SUCCESS
        };

        tester.dispatch(findDeviceSuccess);

        expect(tester.getLatestCalledAction()).toEqual(findDeviceSuccess);
    });

    it('should navigate nowhere from ConnectingScreen more than 1 found device', () => {
        const state = tester.getState();
        state.deviceStatus.connected = { address: '192.168.0.100' };
        state.devices = {
            '192.168.0.100': state.deviceStatus.connected,
            '192.168.0.101': { }
        }

        tester.dispatch({
            type: Types.NAVIGATION_CONNECTING
        });

        expect(tester.getLatestCalledAction()).toEqual(navigateConnecting());
    });

    it('should navigate to DeviceMenuScreen from ConnectingScreen after FIND_DEVICE_SELECT', () => {
        tester.dispatch({
            type: Types.NAVIGATION_CONNECTING
        });

        tester.dispatch({
            type: Types.FIND_DEVICE_SELECT
        });

        expect(tester.getLatestCalledAction()).toEqual(navigateDeviceMenu());
    });

    it('should navigate to WelcomeScreen from ConnectingScreen after no devices found after timeout', () => {
        tester.dispatch({
            type: Types.NAVIGATION_CONNECTING
        });

        return Promise.delay(Config.findDeviceTimeout + 100).then(() => {
            expect(tester.getLatestCalledAction()).toEqual(navigateWelcome());
        });
    });

    it('should navigate to WelcomeScreen from any connectionRequired route after FIND_DEVICE_LOST for connected device', async () => {
        const { nav, deviceStatus } = tester.getState();
        nav.routes[0].params.connectionRequired = true;
        deviceStatus.connected = { key: '127.0.0.1' };

        jest.mock('Alert', () => {
            return {
                alert: jest.fn()
            }
        });

        tester.dispatch({
            type: Types.FIND_DEVICE_LOST,
            address: deviceStatus.connected,
        });

        expect(Alert.alert).toHaveBeenCalled();
        Alert.alert.mock.calls[0][2][0].onPress()

        await tester.waitFor(Types.NAVIGATION_WELCOME);
    });

    it('should navigate nowhere on no connectionRequired route after FIND_DEVICE_LOST', () => {
        const { nav } = tester.getState();
        nav.routes[0].params.connectionRequired = false;

        const findDeviceLost = {
            type: Types.FIND_DEVICE_LOST
        };

        tester.dispatch(findDeviceLost);

        expect(tester.getLatestCalledAction()).toEqual(findDeviceLost);
    });
});
