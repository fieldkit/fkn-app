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

export class DeviceOptions extends React.Component {
    state = {
        recognizedDevice: "",
        modalVisible: false
    };

    componentDidMount = async () => {
        const easyMode = this.props;
        if (easyMode.devices && _.size(easyMode.devices) == 1) {
            try {
                const value = await AsyncStorage.getItem("deviceName" + hexArrayBuffer(easyMode.devices[_.first(_.keys(easyMode.devices))].capabilities.deviceId));
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
                const value = await AsyncStorage.getItem(hexArrayBuffer(easyModeAfter.devices[_.first(_.keys(easyModeAfter.devices))].capabilities.deviceId));
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

    render() {
        const { easyMode, navigateEditDeviceName } = this.props;
        const { downloads } = easyMode.plans;
        const numberOfDevices = _.size(easyMode.devices);
        const { configureName } = this.props;
        const estimatedDownload = _(downloads)
            .map(d => d.plan)
            .flatten()
            .filter(p => p.download)
            .map(p => p.download.downloading)
            .sum();

        if (numberOfDevices == 0 || !_.isArray(downloads) || downloads.length == 0) {
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
            } else {
                return (
                    <View style={textPanelStyle}>
                        <Text style={textStyle}>{i18n.t("easyMode.noDevices")}</Text>
                    </View>
                );
            }
        }

        if (numberOfDevices == 1 && _.toString(this.state.recognizedDevice) != "") {
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
                            <Text style={textStyle}>There's {estimatedDownload} bytes waiting.</Text>
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

        if (numberOfDevices == 1 && _.toString(this.state.recognizedDevice) == "") {
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
                        <Text style={subtitle}>
                            {i18n.t("easyMode.devicesFound", {
                                numberOfDevices: numberOfDevices,
                                estimatedDownload: estimatedDownload
                            })}
                        </Text>
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

        return (
            <View>
                <Text style={textPanelStyle}>
                    {i18n.t("easyMode.devicesFound", {
                        numberOfDevices: numberOfDevices,
                        estimatedDownload: estimatedDownload
                    })}
                </Text>
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
}
