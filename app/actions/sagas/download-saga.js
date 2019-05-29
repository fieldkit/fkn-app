import _ from "lodash";

import { put, take, takeLatest, takeEvery, select, all, race, call, delay } from "redux-saga/effects";

import { QueryType } from "../../lib/protocol";
import { Toasts } from "../../lib/toasts";

import * as Types from "../types";

import { queryCapabilities } from "../device-status";
import { queryFiles, queryDownloadFile } from "../device-data";
import { getDownloadSettings } from "../../reducers/synchronizing";

import { deviceCall } from "./saga-utils";

export function* downloadDataSaga() {
    yield takeLatest(Types.DOWNLOAD_FILE_START, function* watcher(action) {
        try {
            const deviceAction = yield call(deviceCall, queryCapabilities());
            const device = deviceAction.response.capabilities;

            console.log("Device", device);

            const fileAction = yield call(deviceCall, queryFiles());

            const file = _(fileAction.response.files.files)
                .filter(f => f.id == action.id)
                .first();

            console.log("File", file);

            const settings = yield getDownloadSettings(device, file);

            console.log("Settings", settings);

            const download = yield call(deviceCall, queryDownloadFile(device, file, settings));

            console.log("Download", download);

            Toasts.show("Download completed!");
        } catch (err) {
            console.log("Error", err);
            yield put({
                type: Types.DEVICE_CONNECTION_ERROR
            });
        }
    });
}
