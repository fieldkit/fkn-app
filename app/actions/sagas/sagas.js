import { delay } from "redux-saga";
import {
    put,
    take,
    takeLatest,
    takeEvery,
    select,
    all,
    race,
    call
} from "redux-saga/effects";

import * as Types from "./../types";

import { serviceDiscovery } from "./discovery";
import { discoverDevices } from "./handshaking";
import { downloadDataSaga } from "./download-saga";
import { connectionRelatedNavigation } from "./navigation-sagas";
import { selectedDeviceSagas } from "./selected-device-sagas";
import { executePlans } from "./plans";
import { timersSaga } from "./timers";

export function* suspendDuringLongRunningTasks(idleFunctions) {
    while (true) {
        const idleTasks = idleFunctions.map(f => f());
        const { idle, taskStart, downloadStart } = yield race({
            idle: all(idleTasks),
            taskStart: take(Types.TASK_START),
            downloadStart: take(Types.DOWNLOAD_FILE_START)
        });

        if (taskStart) {
            console.log("Suspending during long running task.");
            yield take([Types.TASK_DONE, Types.TASK_CANCEL]);
            console.log("Done, resuming!");
        }

        if (downloadStart) {
            console.log("Suspending during download.");
            yield take([Types.DOWNLOAD_FILE_DONE, Types.DOWNLOAD_FILE_CANCEL]);
            console.log("Done, resuming!");
        }
    }
}

export function* longRunningTask() {
    while (true) {
        yield delay(5000);
        yield put({
            type: Types.TASK_START
        });
        for (let i = 0; i < 10; ++i) {
            yield delay(1000);
            yield put({
                type: Types.TASK_PROGRESS,
                task: {
                    progress: i / 10.0,
                    done: false
                }
            });
        }
        yield put({
            type: Types.TASK_DONE,
            task: {
                done: true
            }
        });
    }
}

export function* lowPriority() {
    while (true) {
        console.log("Low Priority");
        yield delay(1000);
    }
}

export function* rootSaga() {
    yield all([
        timersSaga(),

        // Discover devices, listening for UDP messages.
        serviceDiscovery(),

        // Device stuff.
        selectedDeviceSagas(),
        downloadDataSaga(),
        connectionRelatedNavigation(),

        // EasyMode stuff.
        executePlans(),

        suspendDuringLongRunningTasks([discoverDevices])
        // This is for testing
        // longRunningTask(),
    ]);
}
