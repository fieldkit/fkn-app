import Promise from "bluebird";
import varint from 'varint';
import protobuf from "protobufjs";
import net from "net";

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

// Disable the really verbose logging from this library. With how often we're connecting this is pretty chatty.
net.Socket.prototype._debug = function() {
};

class DeviceConnection {
    rpcImplFactory(host, port, wireQuery, noReply, writer) {
        return new Promise((resolve, reject) => {
            debug("Connecting to", host + ":" + port);

            const client = net.createConnection({
                host: host,
                port: port,
                timeout: 1000
            });

            const returned = [];

            client.on('connect', () => {
                debug("Connected, sending query...");
                client.write(new Buffer(wireQuery));

                if (noReply) {
                    client.end();
                }
            });

            client.on('data', (responseData) => {
                if (writer) {
                    writer.write(responseData);
                }
                else {
                    returned.push(responseData);
                    resolve(responseData);
                }
            });

            client.on('close', () => {
                if (writer) {
                    resolve(writer.close());
                }
                else {
                    if (returned.length == 0 && !noReply) {
                        reject(new Error("No reply"));
                    }
                    else if (noReply) {
                        resolve({});
                    }
                }
            });

            client.on('error', (error) => {
                debug("Error", error.message);
                reject(new Error(error));
            });
        });
    }

    transformResponse(callApi, response) {
        if (callApi.writer || callApi.noReply) {
            return {
                deviceApi: {
                    error: false,
                    pending: false,
                    success: true,
                    blocking: callApi.blocking,
                    address: callApi.address,
                },
                type: callApi.types[1],
                response: response
            };
        }

        const decoded = WireMessageReply.decodeDelimited(protobuf.Reader.create(response));
        if (decoded.type == ReplyType.values.REPLY_ERROR) {
            return {
                deviceApi: {
                    error: false,
                    pending: false,
                    success: true,
                    blocking: callApi.blocking,
                    address: callApi.address,
                },
                type: callApi.types[2],
                response: decoded
            };
        }

        return {
            deviceApi: {
                error: false,
                pending: false,
                success: true,
                blocking: callApi.blocking,
                address: callApi.address,
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
                return this.rpcImplFactory(address.host, address.port, encoded, callApi.noReply === true, callApi.writer);
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
                        success: false,
                        pending: false,
                        blocking: callApi.blocking,
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
            debug('CALL', callApi, 'ERROR', pair.error);

            const rejecting = new Error();
            rejecting.actions = [{
                deviceApi: {
                    pending: false,
                    blocking: callApi.blocking,
                },
                type: callApi.types[2],
                error: pair.error
            }];
            return Promise.reject(rejecting);
        }

        debug('CALL', callApi, 'REPLY', pair.reply);

        return Promise.resolve({
            deviceApi: {
                pending: false,
                blocking: callApi.blocking,
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

const pendingExecutions = { };

export function invokeDeviceApi(callApi) {
    const key = callApi.address.key;
    if (pendingExecutions[key] != null) {
        console.log("Append execution chain", key);
        return pendingExecutions[key] = pendingExecutions[key].then(() => {
            return deviceConnection.execute(callApi);
        }, (ignoredError) => {
            return deviceConnection.execute(callApi);
        });
    }
    return pendingExecutions[key] = deviceConnection.execute(callApi);
}

export default store => dispatch => action => {
    const callApi = action[CALL_DEVICE_API];
    if (typeof callApi === 'undefined') {
        return dispatch(action);
    }

    dispatch({
        deviceApi: {
            pending: true,
            blocking: callApi.blocking,
        },
        type: callApi.types[0]
    });

    if (typeof callApi.address === 'undefined') {
        const address = store.getState().deviceStatus.connected;
        if (typeof address === 'undefined') {
            throw new Error("No address for call!")
        }
        callApi.address = address;
    }

    return invokeDeviceApi(callApi).then(good => {
        dispatch(good);
    }, bad => {
        if (bad.action) {
            dispatch(bad.action);
        } else if (bad.actions) {
            for (let action of bad.actions) {
                dispatch(action);
            }
        } else {
            console.log("No failure action!");
        }
    });
};
