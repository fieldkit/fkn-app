import _ from "lodash";
import { takeLatest, all, put, call } from "redux-saga/effects";
import { delay } from "redux-saga";

import { Platform } from "react-native";
import dgram from "react-native-udp";

import WifiManager from "react-native-wifi";
import NetInfo from "@react-native-community/netinfo";
import ConnectivityTracker from "react-native-connectivity-tracker";

import { unixNow } from "../../lib/helpers";
import Config from "../../config";

import * as Types from "../types";

import { createChannel } from "./channels";

function createNetInfoChannel() {
    const channel = createChannel("NetInfo");

    if (__ENV__ !== "test") {
        const listener = data => {
            console.log("Connection", data);
        };

        NetInfo.addEventListener("connectionChange", listener);

        const onConnectivityChange = (isConnected, timestamp, connectionInfo) => {
            channel.put({
                type: isConnected ? Types.INTERNET_ONLINE : Types.INTERNET_OFFLINE,
                online: isConnected,
                timestamp: timestamp,
                info: connectionInfo
            });

            WifiManager.getCurrentWifiSSID().then(
                ssid => {
                    channel.put(wifiSsidChanged(ssid));
                },
                err => {
                    console.log("WiFi SSID:", err);
                }
            );
        };

        ConnectivityTracker.init({
            onConnectivityChange,
            attachConnectionInfo: true,
            onError: msg => console.log(msg)
        });
    }

    return channel;
}

function* monitorNetInfoEvents(channel) {
    if (Config.serviceDiscoveryOnStartup) {
        while (true) {
            const info = yield call(channel.take);
            yield put(info);
        }
    }
}

function createServiceDiscoveryChannel() {
    const channel = createChannel("SD");

    const port = 54321;
    const previous = {};

    if (__ENV__ !== "test") {
        const socket = dgram.createSocket("udp4");
        socket.bind(port);
        socket.on("message", (data, remoteInfo) => {
            const fdi = findDeviceInfo(remoteInfo.address, remoteInfo.port);
            const last = previous[remoteInfo.address] || 0;
            const elapsed = unixNow() - last;
            if (elapsed > 5) {
                channel.put(fdi);
                previous[remoteInfo.address] = unixNow();
            } else {
                console.log("Dropped", last, elapsed, fdi);
            }
        });
    }

    return channel;
}

function* monitorServiceDiscoveryEvents(channel) {
    if (Config.serviceDiscoveryOnStartup) {
        while (true) {
            const info = yield call(channel.take);
            yield put(info);
        }
    } else if (Config.fixedDeviceInfo) {
        while (true) {
            yield put(findDeviceInfo(Config.fixedDeviceInfo.address, Config.fixedDeviceInfo.port));
            yield delay(1000);
        }
    }
}

export function findDeviceInfo(host, port) {
    return {
        type: Types.FIND_DEVICE_INFO,
        address: {
            host: host,
            port: port,
            key: host,
            valid: port > 0
        }
    };
}

export function wifiSsidChanged(ssid) {
    return {
        type: Types.WIFI_SSID_CHANGED,
        ssid: ssid
    };
}

function* monitorWifi() {
    const channel = createChannel("Wifi");

    let currentSsid = null;
    while (true) {
        WifiManager.getCurrentWifiSSID().then(
            ssid => {
                console.log("SSID", ssid);
                channel.put(ssid);
            },
            err => {
                console.log("WiFi SSID:", err);
            }
        );

        const ssid = yield call(channel.take);
        if (currentSsid != ssid) {
            yield put(wifiSsidChanged(ssid));
            currentSsid = ssid;
        }

        yield delay(1000);
    }
}

function isFkSsidName(ssid) {
    return /^FK-(.+)/.test(ssid);
}

function* fakeDiscoveryOnFkAps() {
    yield takeLatest(Types.WIFI_SSID_CHANGED, function* watcher(action) {
        if (isFkSsidName(action.ssid)) {
            console.log("Faking Device at 192.168.2.1");
            while (true) {
                yield put(findDeviceInfo("192.168.2.1", 54321));
                yield delay(1000);
            }
            console.log(action);
        }
    });
}

export function* serviceDiscovery() {
    yield all([call(monitorServiceDiscoveryEvents, createServiceDiscoveryChannel()), call(monitorNetInfoEvents, createNetInfoChannel()), monitorWifi(), fakeDiscoveryOnFkAps()]);
}
