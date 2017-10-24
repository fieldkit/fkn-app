import 'react-native';

import SagaTester from 'redux-saga-tester';
import Promise from "bluebird";

import { Alert } from 'react-native';

import * as Types from './types';
import { findDeviceInfo } from './discovery';
import { connectionRelatedNavigation } from './sagas';
import { useFakeDeviceConnection } from '../middleware/device-api';
import { QueryType, ReplyType } from '../lib/protocol';

import { navigateConnecting, navigateDeviceMenu, navigateWelcome } from './navigation';

describe('device connection navigation', () => {
    let tester;
    let fakeDevice;
    let task;

    beforeEach(() => {
        fakeDevice = useFakeDeviceConnection();
        tester = new SagaTester({
            initialState: {
                deviceStatus: {},
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

    it('should navigate nowhere on WelcomeScreen after FIND_DEVICE_SUCCESS', () => {
        const findDeviceSuccess = {
            type: Types.FIND_DEVICE_SUCCESS
        };

        tester.dispatch(findDeviceSuccess);

        expect(tester.getLatestCalledAction()).toEqual(findDeviceSuccess);
    });

    it('should navigate directly to DeviceMenuScreen from ConnectingScreen if already connected', () => {
        const { deviceStatus } = tester.getState();
        deviceStatus.connected = true;

        tester.dispatch({
            type: Types.NAVIGATION_CONNECTING
        });

        expect(tester.getLatestCalledAction()).toEqual(navigateDeviceMenu());
    });

    it('should navigate to DeviceMenuScreen from ConnectingScreen after FIND_DEVICE_SUCCESS', () => {
        tester.dispatch({
            type: Types.NAVIGATION_CONNECTING
        });

        tester.dispatch({
            type: Types.FIND_DEVICE_SUCCESS
        });

        expect(tester.getLatestCalledAction()).toEqual(navigateDeviceMenu());
    });

    it('should navigate to WelcomeScreen from ConnectingScreen after FIND_DEVICE_FAIL', () => {
        tester.dispatch({
            type: Types.NAVIGATION_CONNECTING
        });

        tester.dispatch({
            type: Types.FIND_DEVICE_FAIL
        });

        expect(tester.getLatestCalledAction()).toEqual(navigateWelcome());
    });

    it('should navigate to WelcomeScreen from any connectionRequired route after FIND_DEVICE_LOST', async () => {
        const { nav } = tester.getState();
        nav.routes[0].params.connectionRequired = true;

        jest.mock('Alert', () => {
            return {
                alert: jest.fn()
            }
        });

        tester.dispatch({
            type: Types.FIND_DEVICE_LOST
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
