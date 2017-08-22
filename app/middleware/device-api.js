'use strict';

import Promise from "bluebird";
import net from "net";
import protobuf from "protobufjs";

export const CALL_DEVICE_API = Symbol('Call Device API');

const root = protobuf.Root.fromJSON(require("./fieldkit-device.proto.json"));
const RequestHeader = root.lookupType("fieldkitdevice.RequestHeader");
const ResponseHeader = root.lookupType("fieldkitdevice.ResponseHeader");
const PingRequest = root.lookupType("fieldkitdevice.PingRequest");
const PingResponse = root.lookupType("fieldkitdevice.PingResponse");
const MessageType = root.lookup("fieldkitdevice.RequestHeader.MessageType");

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

function rpcImplFactory(host, port) {
    return (method, requestData, callback) => {
        const enumName = toUnderscoreUpper(method.name);
        const messageType = MessageType.values[enumName];
        if (typeof(messageType) == undefined) {
            debug("Unknown message type:", method.name, "(" + enumName + ")");
            throw "Unknown message type: " + method.name;
        }

        const headerData = RequestHeader.encode({
            type: messageType
        }).finish();

        debug("Connecting to", host + ":" + port);

        const client = net.createConnection({
            host: host,
            port: port,
            timeout: 1000
        });

        client.on('error', (error) => {
            debug("Error", error.message);

            callback(error, null);
        });

        client.on('data', (responseData) => {
            callback(null, responseData);
        });

        client.on('connect', () => {
            debug("Connected, executing", method.name);

            client.write(new Buffer(headerData));
            client.write(new Buffer(requestData));
        });
    };
}

function api(address) {
    const Service = root.lookup("Service");
    return Promise.resolve(Promise.promisifyAll(Service.create(rpcImplFactory(address.host, address.port), false, false)));
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
        return api(callApi.address)
            .then(callApi.call)
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
