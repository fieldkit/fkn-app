import * as Types from "./types";

export function startLiveDataPoll() {
    return {
        type: Types.LIVE_DATA_POLL_START
    };
}

export function stopLiveDataPoll() {
    return {
        type: Types.LIVE_DATA_POLL_STOP
    };
}
