import 'react-native';

import SagaTester from 'redux-saga-tester';
import Promise from "bluebird";

import * as Types from './types';
import { liveDataSaga } from './live-data-saga';
import { useFakeDeviceConnection } from '../middleware/device-api';
import { QueryType, ReplyType } from '../lib/protocol';

describe('live data saga', () => {
    let tester;
    let fakeDevice;

    beforeEach(() => {
        fakeDevice = useFakeDeviceConnection();
        tester = new SagaTester({
            initialState: {
                deviceStatus: {
                    address: {}
                }
            }
        });
        tester.start(liveDataSaga);
    });

    it('should poll for data until stopped', async () => {
        for (let i = 0; i < 3; ++i) {
            fakeDevice.push({}, {
                type: ReplyType.values.REPLY_LATEST_DATA_SET,
                dataSets: {
                    dataSets: [{
                        pages: 2
                    }]
                }
            });
        }

        tester.dispatch({
            type: Types.LIVE_DATA_POLL_START
        });

        const pollStart = await tester.waitFor(Types.DEVICE_LIVE_DATA_POLL_START);

        expect(pollStart.message.liveDataPoll.interval).toBe(1000);

        await tester.waitFor(Types.DEVICE_LIVE_DATA_POLL_SUCCESS);

        tester.reset(true);

        await tester.waitFor(Types.DEVICE_LIVE_DATA_POLL_START);

        await tester.waitFor(Types.DEVICE_LIVE_DATA_POLL_SUCCESS);

        tester.reset(true);

        tester.dispatch({
            type: Types.LIVE_DATA_POLL_STOP
        });

        const pollEnd = await tester.waitFor(Types.DEVICE_LIVE_DATA_POLL_START);

        expect(pollEnd.message.liveDataPoll.interval).toBe(0);

        await tester.waitFor(Types.DEVICE_LIVE_DATA_POLL_SUCCESS);

        expect(fakeDevice.queue).toHaveLength(0);
    });
});

