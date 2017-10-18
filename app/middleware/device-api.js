'use strict';

import Promise from "bluebird";
import net from "net";
import protobuf from "protobufjs";

import {
    WireMessageQuery,
    WireMessageReply,
    QueryType,
    ReplyType
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

        client.on('connect', () => {
            debug("Connected, sending query...");
            client.write(new Buffer(wireQuery));
        });

        client.on('data', (responseData) => {
            received = true;
            resolve(responseData);
        });

        client.on('close', () => {
            debug("closed");
            if (!received) {
                reject(new Error("No reply"));
            }
        });

        client.on('error', (error) => {
            debug("Error", error.message);
            reject(new Error(error));
        });
    });
}

function transformResponse(callApi, response) {
    const decoded = WireMessageReply.decodeDelimited(protobuf.Reader.create(response));
    if (decoded.type == ReplyType.values.REPLY_ERROR) {
        return {
            deviceApi: {
                pending: false
            },
            type: callApi.types[2],
            response: decoded
        };
    }

    return {
        deviceApi: {
            pending: false
        },
        type: callApi.types[1],
        response: decoded
    };
}

function makeRequest(callApi) {
    return Promise.resolve(callApi.address)
        .then(address => {
            const encoded = WireMessageQuery.encodeDelimited(callApi.message).finish();
            return rpcImplFactory(address.host, address.port, encoded);
        })
        .then(response => {
            return transformResponse(callApi, response);
        }, error => {
            const rejecting = new Error();
            rejecting.action = {
                deviceApi: {
                    pending: false
                },
                type: callApi.types[2],
                error: error.message
            };
            return rejecting;
        });
}

export function invokeDeviceApi(callApi) {
    return makeRequest(callApi);
}

export default store => dispatch => action => {
    const callApi = action[CALL_DEVICE_API];
    if (typeof callApi === 'undefined') {
        return dispatch(action);
    }

    dispatch({
        deviceApi: {
            pending: true
        },
        type: callApi.types[0]
    });

    return makeRequest(callApi).then(good => {
        dispatch(good);
    }, bad => {
        dispatch(bad);
    });
};
