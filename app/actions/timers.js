import * as ActionTypes from "./types";

export function timerStart(name, seconds) {
    return {
        type: ActionTypes.TIMER_START,
        name: name,
        seconds: seconds,
        remaining: seconds,
        done: false
    };
}

export function timerTick(name, seconds, remaining) {
    return {
        type: ActionTypes.TIMER_TICK,
        name: name,
        seconds: seconds,
        remaining: remaining,
        done: false
    };
}

export function timerCancel(name) {
    return {
        type: ActionTypes.TIMER_CANCEL,
        name: name
    };
}

export function timerDone(name, seconds) {
    return {
        type: ActionTypes.TIMER_DONE,
        name: name,
        seconds: seconds,
        remaining: 0,
        done: true
    };
}
