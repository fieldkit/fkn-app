import Promise from "bluebird";
import { Alert } from "react-native";
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

import { QueryType } from "../../lib/protocol";
import { unixNow } from "../../lib/helpers";
import Config from "../../config";

import * as Types from "./../types";
import { timerTick, timerDone } from "../timers";

export function* timersSaga() {
    yield takeEvery(Types.TIMER_START, function*(start) {
        const started = unixNow();
        while (true) {
            const elapsed = unixNow() - started;
            if (elapsed >= start.seconds) {
                yield put(timerDone(start.name, start.seconds));
                break;
            }
            yield put(
                timerTick(start.name, start.seconds, start.seconds - elapsed)
            );
            const { cancel, to } = yield race({
                cancel: take(Types.TIMER_CANCEL),
                to: delay(800)
            });
            if (cancel && cancel.name === start.name) {
                break;
            }
        }
    });
}
