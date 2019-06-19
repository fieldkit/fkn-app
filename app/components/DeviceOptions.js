import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, TextInput, ScrollView, Modal } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import KeepAwake from "react-native-keep-awake";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

import * as Files from "../lib/files";
import { AppPermissions } from "../lib/permissions";

import { AppScreen, Button } from "../components";

import { navigateWelcome, navigateEditDeviceName, deviceStartConnect, findAllFiles, executePlan, deleteAllLocalFiles, archiveAllLocalFiles, configureName } from "../actions";

import Config from "../config";

import { textStyle, textPanelStyle, title, subtitle, cardWrapper, cardStyle } from "../styles";

export function makeDeviceNameKey(deviceId) {
    if (_.isString(deviceId)) {
        return "device-name:" + deviceId;
    }
    return "device-name:" + hexArrayBuffer(deviceId);
}

export function isDeviceNameKey(key) {
    return key.indexOf("device-name:") === 0;
}

export function getDeviceIdFromKey(key) {
    return key.replace("device-name:", "");
}

export class DeviceOptions extends React.Component {
    state = {
        recognizedDevice: "",
        modalVisible: false
    };

    componentDidMount = async () => {
        const easyMode = this.props;
        if (easyMode.devices && _.size(easyMode.devices) == 1) {
            try {
                const key = makeDeviceNameKey(easyMode.devices[_.first(_.keys(easyMode.devices))].capabilities.deviceId);
                const value = await AsyncStorage.getItem(key);
                this.setState({ recognizedDevice: value });
            } catch (error) {
                console.log(error);
            }
        }
    };

    componentWillUpdate = async (nextProps, nextState) => {
        const { easyMode: easyModeBefore } = this.props;
        const { easyMode: easyModeAfter } = nextProps;
        const { deviceName: deviceNameBefore } = this.state;
        const { deviceName: deviceNameAfter } = nextState;

        if (easyModeAfter.devices != easyModeBefore.devices && _.size(easyModeAfter.devices) == 1) {
            try {
                const key = makeDeviceNameKey(easyModeAfter.devices[_.first(_.keys(easyModeAfter.devices))].capabilities.deviceId);
                const value = await AsyncStorage.getItem(key);
                this.setState({ recognizedDevice: value });
            } catch (error) {
                console.log(error);
            }
        }
    };

    onSync() {
        const { easyMode, executePlan } = this.props;
        const { downloads } = easyMode.plans;

        executePlan(
            _(downloads)
                .map(r => r.plan)
                .flatten()
                .value()
        );
    }

    renderNoDevices(easyMode, summary) {
        if (!easyMode.networkConfiguration.deviceAp) {
            return (
                <View>
                    <View style={cardWrapper}>
                        <View style={cardStyle}>
                            <Image
                                source={require("../../assets/fogg-no-comments.png")}
                                style={{
                                    resizeMode: "contain",
                                    width: "100%",
                                    height: 180
                                }}
                            />
                            <Text style={subtitle}>No Devices Found</Text>
                            <Text style={textStyle}>Please connect to a FieldKit WiFi access point.</Text>
                            <View style={{ alignItems: "center", paddingTop: 5 }}>
                                <Button
                                    onPress={() => {
                                        this.setState({ modalVisible: !this.state.modalVisible });
                                    }}
                                    title="Connect Device Guide"
                                />
                            </View>
                        </View>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                        }}
                    >
                        <View style={textPanelStyle}>
                            <Text
                                style={{
                                    paddingTop: 20,
                                    paddingLeft: 10,
                                    paddingBottom: 20,
                                    fontSize: 30,
                                    fontWeight: "bold"
                                }}
                            >
                                Connect to Your Fieldkit
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    paddingLeft: 10,
                                    paddingBottom: 20
                                }}
                            >
                                1. Press button on device
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    paddingLeft: 10,
                                    paddingBottom: 20
                                }}
                            >
                                2. Go to your Wifi settings on your phone
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    paddingLeft: 10,
                                    paddingBottom: 40
                                }}
                            >
                                3. Select your FieldKit device to connect
                            </Text>
                            <Button
                                onPress={() => {
                                    this.setState({ modalVisible: !this.state.modalVisible });
                                }}
                                title="Done"
                            />
                        </View>
                    </Modal>
                </View>
            );
        }

        return (
            <View style={textPanelStyle}>
                <Text style={textStyle}>{i18n.t("easyMode.noDevices")}</Text>
            </View>
        );
    }

    renderOneConnectedDevice(easyMode, summary) {
        const { configureName, navigateEditDeviceName } = this.props;

        if (_.toString(this.state.recognizedDevice) != "") {
            return (
                <View>
                    <View style={cardWrapper}>
                        <View style={cardStyle}>
                            <Image
                                source={require("../../assets/fieldkit_river.jpg")}
                                style={{
                                    resizeMode: "contain",
                                    width: "100%",
                                    height: 200
                                }}
                            />
                            <Text style={subtitle}>Connected to {this.state.recognizedDevice}!</Text>
                            <View
                                style={{
                                    alignItems: "center"
                                }}
                            >
                                <Button title="Edit Device Name" onPress={() => navigateEditDeviceName("deviceName" + hexArrayBuffer(easyMode.singleDevice.capabilities.deviceId), easyMode.singleDevice.address)} />
                            </View>
                        </View>
                    </View>
                    <View style={cardWrapper}>
                        <View style={cardStyle}>
                            <Text style={textStyle}>There's {summary.estimatedDownload} bytes waiting.</Text>
                            <View
                                style={{
                                    alignItems: "center"
                                }}
                            >
                                <Button title={i18n.t("easyMode.syncPhone")} onPress={() => this.onSync()} />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View style={cardWrapper}>
                <View style={cardStyle}>
                    <Image
                        source={require("../../assets/fieldkit_river.jpg")}
                        style={{
                            resizeMode: "contain",
                            width: "100%",
                            height: 200
                        }}
                    />
                    <Text style={subtitle}>{i18n.t("easyMode.devicesFound", summary)}</Text>
                    <View
                        style={{
                            alignItems: "center"
                        }}
                    >
                        <Button title="Set Device Name" onPress={() => navigateEditDeviceName(hexArrayBuffer(easyMode.singleDevice.capabilities.deviceId), easyMode.singleDevice.address)} />
                        <Button title={i18n.t("easyMode.syncPhone")} onPress={() => this.onSync()} />
                    </View>
                </View>
            </View>
        );
    }

    renderMultipleConnectedDevices(easyMode, summary) {
        return (
            <View>
                <Text style={textPanelStyle}>{i18n.t("easyMode.devicesFound", summary)}</Text>
                <View style={textPanelStyle}>
                    <Text style={{ textAlign: "center" }}>1. Press button on device</Text>
                    <Text style={{ textAlign: "center" }}>2. Go to your Wifi settings on your phone</Text>
                    <Text style={{ textAlign: "center" }}>3. Select your FieldKit device to connect</Text>
                </View>
                <View
                    style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingBottom: 10,
                        width: "100%"
                    }}
                >
                    <Button title={i18n.t("easyMode.syncPhone")} onPress={() => this.onSync()} />
                </View>
            </View>
        );
    }

    render() {
        const { easyMode } = this.props;
        const numberOfDevices = _.size(easyMode.devices);
        const estimatedDownload = _(easyMode.plans.downloads)
            .map(d => d.plan)
            .flatten()
            .filter(p => p.download)
            .map(p => p.download.downloading)
            .sum();

        const summary = {
            numberOfDevices,
            estimatedDownload
        };

        if (numberOfDevices > 0) {
            if (numberOfDevices == 1) {
                return this.renderOneConnectedDevice(easyMode, summary);
            }
            return this.renderMultipleConnectedDevices(easyMode, summary);
        }

        return this.renderNoDevices(easyMode, summary);
    }
}
