import _ from 'lodash';

import { delay } from 'redux-saga'
import { put, take, takeLatest, takeEvery, select, all, race, call } from 'redux-saga/effects'

import { QueryType } from '../../lib/protocol';

import * as Types from '../types';

import { queryCapabilities } from '../device-status';
import { queryFiles, queryDownloadFile } from '../device-data';

import { deviceCall } from './saga-utils';

function areTokensEqual(t1, t2) {
    if (t1 == null && t2 == null) {
        return true;
    }
    if (t1 == null || t2 == null || t1.byteLength != t2.byteLength) {
        return false;
    }
    const a1 = new Int8Array(t1);
    const a2 = new Int8Array(t2);
    for (let i = 0; i != t1.byteLength; i++) {
        if (a1[i] != a2[i]) return false;
    }
    return true;
}

export function* downloadDataSaga() {
    yield takeLatest(Types.DOWNLOAD_FILE_START, function* watcher(action) {
        const state = yield select();

        const deviceAction = yield call(deviceCall, queryCapabilities());
        const device = deviceAction.response.capabilities;

        console.log(device);

        const fileAction = yield call(deviceCall, queryFiles());

        const file = _(fileAction.response.files.files).filter(f => f.id == action.id).first();

        console.log("File", file);

        const download = yield call(deviceCall, queryDownloadFile(device, file));

        console.log("Download", download);
    });
}
