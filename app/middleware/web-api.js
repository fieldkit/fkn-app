"use strict";

import Promise from "bluebird";

export const CALL_WEB_API = Symbol("Call Web API");

export default store => dispatch => action => {
    const callApi = action[CALL_WEB_API];
    if (typeof callApi === "undefined") {
        return dispatch(action);
    }

    return dispatch(action);
};
