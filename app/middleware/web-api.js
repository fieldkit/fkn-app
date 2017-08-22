'use strict';

import Promise from "bluebird";

export const CALL_WEB_API = Symbol('Call Web API');
export const WEB_API_AUTHENTICATION_REDIRECTED = 'webApiAuthenticationRedirected';

export default store => next => action => {
    const callApi = action[CALL_WEB_API];
    if (typeof callApi === 'undefined') {
        return next(action);
    }

    function actionWith(data) {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_WEB_API];
        return finalAction;
    }

    if (callApi.types.length > 1) {
        next(actionWith({
            network: {
                pending: true
            },
            type: callApi.types[0]
        }));
    }

    var options = {
        credentials: 'include',
        method: callApi.method || 'GET',
        body: callApi.body ? JSON.stringify(callApi.body) : null,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };

    function makeRequest(callApi, options) {
        return fetch(callApi.url, options).then((response) => {
            return response.json().then((body) => {
                if (response.status === 401) {
                    next({
                        type: WEB_API_AUTHENTICATION_REDIRECTED,
                        webApi: {
                            pending: false
                        }
                    })
                    window.location = '/auth'; // Hack
                }
                else if (response.status === 503) {
                    setTimeout(() => {
                        makeRequest(callApi, options);
                    }, 1000);
                }
                else {
                    next(actionWith({
                        webApi: {
                            pending: false
                        },
                        type: callApi.types[callApi.types.length == 1 ? 0 : 1],
                        response: body
                    }));
                }
            });
        });
    }

    return makeRequest(callApi, options);
};
