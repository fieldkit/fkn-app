'use strict';

import Promise from "bluebird";
import net from "net";
import protobuf from "protobufjs";

import {
    WireMessageQuery,
    WireMessageReply,
    QueryType
} from '../lib/protocol';

export const CALL_DEVICE_API = Symbol('Call Device API');

function toUnderscoreUpper(camelCase) {
    return camelCase.replace(/([A-Z])/g, function($1) {
        return "_" + $1;
    }).substring(1).toUpperCase();
}

function debug() {
    if (__DEV__) {
        let args = [].slice.call(arguments);
        args.unshift('device-api');
        console.log.apply(console, args);
    }
};

function rpcImplFactory(host, port, wireQuery) {
    return new Promise((resolve, reject) => {
        debug("Connecting to", host + ":" + port);

        const client = net.createConnection({
            host: host,
            port: port,
            timeout: 1000
        });

        let received = false;

        client.on('close', () => {
            debug("closed");
            if (!received) {
                reject("No reply");
            }
        });

        client.on('error', (error) => {
            debug("Error", error.message);
            reject(error);
        });

        client.on('data', (responseData) => {
            received = true;
            resolve(responseData);
        });

        client.on('connect', () => {
            debug("Connected, sending query...");
            client.write(new Buffer(wireQuery));
        });
    });
}

export default store => next => action => {
    const callApi = action[CALL_DEVICE_API];
    if (typeof callApi === 'undefined') {
        return next(action);
    }

    function actionWith(data) {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_DEVICE_API];
        return finalAction;
    }

    next(actionWith({
        deviceApi: {
            pending: true
        },
        type: callApi.types[0]
    }));

    function makeRequest(callApi) {
        return Promise.resolve(callApi.address)
            .then(address => {
                const encoded = WireMessageQuery.encodeDelimited(callApi.message).finish();
                return rpcImplFactory(address.host, address.port, encoded);
            })
            .then(response => {
                const nextAction = actionWith({
                    deviceApi: {
                        pending: false
                    },
                    type: callApi.types[1],
                    response: response
                });

                next(nextAction);
            }, error => {
                const nextAction = actionWith({
                    deviceApi: {
                        pending: false
                    },
                    type: callApi.types[2],
                    error: error.message
                });

                next(nextAction);
            });
    }

    return makeRequest(callApi);
};
