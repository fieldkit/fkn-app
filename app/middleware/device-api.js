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

import * as Types from '../actions/types';

export const CALL_DEVICE_API = Symbol('Call Device API');

function debug() {
    if (__DEV__) {
        let args = [].slice.call(arguments);
        args.unshift('device-api');
        console.log.apply(console, args);
    }
};

let pendingExecution = null;

class DeviceConnection {
    rpcImplFactory(host, port, wireQuery) {
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

    transformResponse(callApi, response) {
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

    execute(callApi) {
        return Promise.resolve(callApi.address)
            .then(address => {
                if (!address.valid) {
                    return Promise.reject(new Error("Invalid address"));
                }
                return address;
            })
            .then(address => {
                const encoded = WireMessageQuery.encodeDelimited(callApi.message).finish();
                return this.rpcImplFactory(address.host, address.port, encoded);
            })
            .then(response => {
                return this.transformResponse(callApi, response);
            }, error => {
                console.log("Rejecting", error.message);

                const rejecting = new Error(error.message);
                rejecting.actions = [];

                if (error.message == 'Error: Connection refused') {
                    rejecting.actions.push({
                        type: Types.DEVICE_CONNECTION_ERROR
                    });
                }

                rejecting.actions.push({
                    deviceApi: {
                        error: true,
                        pending: false
                    },
                    type: callApi.types[2],
                    message: error.message,
                    error: error
                });

                return Promise.reject(rejecting);
            });
    }
}

export class FakeDeviceConnection {
    queue = []

    push(query, reply) {
        this.queue.push({
            query,
            reply
        });
    }

    pushError(query, error) {
        this.queue.push({
            query,
            error
        });
    }

    execute(callApi) {
        if (this.queue.length == 0) {
            console.log("No enqueued fake replies!", callApi);
            throw new Error("No enqueued fake replies!");
        }

        const pair = this.queue.shift();

        if (pair.error) {
            // console.log('CALL', callApi, 'ERROR', pair.error);

            const rejecting = new Error();
            rejecting.action = {
                deviceApi: {
                    pending: false
                },
                type: callApi.types[2],
                error: pair.error
            };
            return Promise.reject(rejecting);
        }

        // console.log('CALL', callApi, 'REPLY', pair.reply);

        return Promise.resolve({
            deviceApi: {
                pending: false
            },
            type: callApi.types[1],
            response: pair.reply
        });
    }
}

let deviceConnection = new DeviceConnection();

export function useFakeDeviceConnection() {
    return deviceConnection = new FakeDeviceConnection();
}

export function invokeDeviceApi(callApi) {
    if (pendingExecution != null) {
        console.log("Append execution chain...");
        return pendingExecution = pendingExecution.then(() => {
            return deviceConnection.execute(callApi);
        }, (ignoredError) => {
            return deviceConnection.execute(callApi);
        });
    }
    console.log("New execution chain...");
    return pendingExecution = deviceConnection.execute(callApi);
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

    return deviceConnection.execute(callApi).then(good => {
        dispatch(good);
    }, bad => {
        dispatch(bad);
    });
};
