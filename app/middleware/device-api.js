'use strict';

import Promise from "bluebird";
import net from "net";
import ServiceDiscovery from "react-native-service-discovery";
import protobuf from "protobufjs";

export const CALL_DEVICE_API = Symbol('Call Device API');

const root = protobuf.Root.fromJSON(require("./fieldkit-device.proto.json"));
const RequestHeader = root.lookupType("fieldkitdevice.RequestHeader");
const ResponseHeader = root.lookupType("fieldkitdevice.ResponseHeader");
const HelloRequest = root.lookupType("fieldkitdevice.HelloRequest");
const HelloResponse = root.lookupType("fieldkitdevice.HelloResponse");
const MessageType = root.lookup("fieldkitdevice.RequestHeader.MessageType");

function discoverDevice() {
    return new Promise(function (resolve, reject) {
        const sd = new ServiceDiscovery();

        sd.on('service-resolved', (ev) => {
            console.log("SVC", ev);
        });

        sd.on('udp-discovery', (ev) => {
            console.log("UDP", ev);
            sd.stop();
            resolve(ev);
        });

        sd.start();
    });
}

function toUnderscoreUpper(camelCase) {
    return camelCase.replace(/([A-Z])/g, function($1) {
        return "_" + $1;
    }).substring(1).toUpperCase();
}

function rpcImplFactory(address, port) {
    return (method, requestData, callback) => {
        const enumName = toUnderscoreUpper(method.name);
        const messageType = MessageType.values[enumName];
        if (typeof(messageType) == undefined) {
            console.log("Unknown message type: " + method.name + " (" + enumName + ")");
            throw "Unknown message type: " + method.name;
        }

        const headerData = RequestHeader.encode({
            type: messageType
        }).finish();

        console.log("Connecting to " + address + ":" + port + "...");

        const client = net.createConnection(port, address);

        client.on('error', (error) => {
            console.log("Error", error);
        });

        client.on('data', (responseData) => {
            callback(null, responseData);
        });

        client.on('connect', () => {
            console.log("Connected, executing", method.name);

            client.write(new Buffer(headerData));
            client.write(new Buffer(requestData));
        });
    };
}

function api() {
    return discoverDevice().then(info => {
        const Service = root.lookup("Service");
        return Promise.promisifyAll(Service.create(rpcImplFactory(info.address, info.port), false, false));
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

    if (callApi.types.length > 1) {
        next(actionWith({
            network: {
                pending: true
            },
            type: callApi.types[0]
        }));
    }

    function makeRequest(callApi) {
        return api()
            .then(callApi.call)
            .then(response => {
                next(actionWith({
                    network: {
                        pending: false
                    },
                    type: callApi.types[callApi.types.length == 1 ? 0 : 1],
                    response: response
                }));
            });
    }

    return makeRequest(callApi);
};
