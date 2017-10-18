'use strict'

import { delay } from 'redux-saga'
import { put, takeEvery, all } from 'redux-saga/effects'

export function* helloSaga() {
    console.log("Hello Sagas");
    yield delay(1000)
    console.log("Hello Sagas");
    yield put({ type: 'INCREMENT' })
}

export function* rootSaga() {
    yield all([
        helloSaga(),
    ])
}
