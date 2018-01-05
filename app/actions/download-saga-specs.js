import 'react-native';

import SagaTester from 'redux-saga-tester';
import Promise from "bluebird";

import * as Types from './types';
import { downloadDataSaga } from './download-saga';
import { useFakeDeviceConnection } from '../middleware/device-api';
import { QueryType, ReplyType } from '../lib/protocol';

describe('download data saga', () => {
    let tester;
    let fakeDevice;
    let task;

    beforeEach(() => {
        fakeDevice = useFakeDeviceConnection();
        tester = new SagaTester({
            initialState: {
                deviceStatus: {
                    address: {}
                }
            }
        });

        task = tester.start(downloadDataSaga);
    });

    afterEach(() => {
        task.cancel();
    });

    it('should download each page and then finish', async () => {
        fakeDevice.push({}, {
            type: ReplyType.values.REPLY_DATA_SET,
            dataSets: {
                dataSets: [{
                    pages: 2
                }]
            }
        });

        fakeDevice.push({}, {
            type: ReplyType.values.REPLY_DOWNLOAD_DATA_SET,
            downloadDataSet: {}
        });

        fakeDevice.push({}, {
            type: ReplyType.values.REPLY_DOWNLOAD_DATA_SET,
            downloadDataSet: {}
        });

        tester.dispatch({
            type: Types.DOWNLOAD_DATA_SET_START
        });

        await tester.waitFor(Types.DEVICE_DOWNLOAD_DATA_SET_SUCCESS);

        await tester.waitFor(Types.DOWNLOAD_DATA_SET_PROGRESS);

        await tester.waitFor(Types.DEVICE_DOWNLOAD_DATA_SET_SUCCESS);

        await tester.waitFor(Types.DOWNLOAD_DATA_SET_PROGRESS);

        await tester.waitFor(Types.DOWNLOAD_DATA_SET_DONE);
    });
});

