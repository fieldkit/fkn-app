import * as ActionTypes from "./types";

export * from "./navigation";
export * from "./emails";
export * from "./device-status";
export * from "./device-data";
export * from "./timers";
export * from "./modules";
export * from "./configuration";
export * from "./live-data";
export * from "./local-files";
export * from "./plans";
export * from "./location";

export const Types = ActionTypes;

import { getDeviceInformation } from "../lib/device-information";

export function initialize() {
    return dispatch => {
        if (__ENV__ !== "test") {
            return getDeviceInformation().then(info => {
                dispatch({
                    type: Types.HOST_INFORMATION,
                    info: info
                });
            });
        }
    };
}
