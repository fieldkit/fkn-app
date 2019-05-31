import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, Button, TextInput, ScrollView, AsyncStorage } from "react-native";

import KeepAwake from "react-native-keep-awake";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

import * as Files from "../lib/files";
import { AppPermissions } from "../lib/permissions";

import { AppScreen } from "../components";

import { navigateWelcome, navigateEditDeviceName, deviceStartConnect, findAllFiles, executePlan, deleteAllLocalFiles, archiveAllLocalFiles } from "../actions";

import styles from "../styles";

const textPanelStyle = {
    padding: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)"
};

const textStyle = {
    padding: 10,
    textAlign: "center"
};

class UploadQueueOptions extends React.Component {
    onSync() {
        const { easyMode, executePlan } = this.props;
        const { uploads } = easyMode.plans;

        executePlan(
            _(uploads)
                .map(r => r.plan)
                .flatten()
                .value()
        );

        try {
            AsyncStorage.getAllKeys((err, keys) => {
                AsyncStorage.multiGet(keys, (err, stores) => {
                    stores.map((result, i, store) => {
                        fetch("https://api.fkdev.org/devices/0004a30b00232b9b", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                deviceId: store[i][0],
                                name: store[i][1]
                            })
                        });
                    });
                });
            });
            console.log("SUCCESS");
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const { easyMode } = this.props;
        const { uploads } = easyMode.plans;
        const { networkConfiguration } = easyMode;

        const numberOfFiles = _(uploads)
            .map(r => r.numberOfFiles)
            .sum();
        const estimatedUpload = _(uploads)
            .map(d => d.plan)
            .flatten()
            .filter(p => p.upload)
            .map(p => p.upload.uploading)
            .sum();

        if (numberOfFiles == 0) {
            return (
                <View style={textPanelStyle}>
                    <Text style={textStyle}>{i18n.t("easyMode.noPendingFiles")}</Text>
                </View>
            );
        }

        if (!networkConfiguration.internet.online) {
            return (
                <View style={textPanelStyle}>
                    <Text style={textStyle}>
                        {i18n.t("easyMode.pendingFiles", {
                            numberOfFiles: numberOfFiles,
                            estimatedUpload: estimatedUpload
                        })}{" "}
                        {i18n.t("easyMode.offline")}
                    </Text>
                </View>
            );
        }

        return (
            <View>
                <View style={textPanelStyle}>
                    <Text style={textStyle}>
                        {i18n.t("easyMode.pendingFiles", {
                            numberOfFiles: numberOfFiles,
                            estimatedUpload: estimatedUpload
                        })}
                    </Text>
                </View>
                <View style={{ padding: 10 }}>
                    <Button title={i18n.t("easyMode.syncServer")} onPress={() => this.onSync()} />
                </View>
            </View>
        );
    }
}

class DeviceOptions extends React.Component {
    state = {
        recognizedDevice: ""
    };

    componentDidMount = async () => {
        const easyMode = this.props;
        if (easyMode.devices && _.size(easyMode.devices) == 1) {
            try {
                const value = await AsyncStorage.getItem(hexArrayBuffer(easyMode.devices[_.first(_.keys(easyMode.devices))].capabilities.deviceId));
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
        const estimatedDownload = _(downloads)
            .map(d => d.plan)
            .flatten()
            .filter(p => p.download)
            .map(p => p.download.downloading)
            .sum();
        if (numberOfDevices == 0 || !_.isArray(downloads) || downloads.length == 0) {
            if (!easyMode.networkConfiguration.deviceAp) {
                return (
                    <View style={textPanelStyle}>
                        <Text style={textStyle}>{i18n.t("easyMode.noDevicesConnect")}</Text>
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

        if (numberOfDevices == 1 && this.state.recognizedDevice != null) {
            console.log("went through and this is device name", this.state.recognizedDevice);
            return (
                <View>
                    <Text style={textPanelStyle}>{this.state.recognizedDevice} was found.</Text>
                    <View
                        style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingBottom: 10,
                            width: "100%"
                        }}
                    >
                        <Button title="Edit Device Name" onPress={() => navigateEditDeviceName(hexArrayBuffer(easyMode.devices[_.first(_.keys(easyMode.devices))].capabilities.deviceId))} />
                    </View>
                    <Text style={textPanelStyle}>Syncing will download {estimatedDownload} bytes.</Text>
                    <Button title={i18n.t("easyMode.syncPhone")} onPress={() => this.onSync()} />
                </View>
            );
        }

        if (numberOfDevices == 1 && this.state.recognizedDevice == "") {
            return (
                <View>
                    <Text style={textPanelStyle}>
                        {i18n.t("easyMode.devicesFound", {
                            numberOfDevices: numberOfDevices,
                            estimatedDownload: estimatedDownload
                        })}
                    </Text>
                    <View
                        style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingBottom: 10,
                            width: "100%"
                        }}
                    >
                        <Button title="Set Device Name" onPress={() => navigateEditDeviceName(hexArrayBuffer(easyMode.devices[_.first(_.keys(easyMode.devices))].capabilities.deviceId))} />
                    </View>
                    <Button title={i18n.t("easyMode.syncPhone")} onPress={() => this.onSync()} />
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

class EasyModeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return { title: i18n.t("easyMode.title") };
    };

    componentDidMount() {
        this.props.findAllFiles();
        this.props.deviceStartConnect();

        new AppPermissions().verifyPermissions();
    }

    componentWillUpdate(nextProps, nextState) {
        const { easyMode: easyModeBefore } = this.props;
        const { easyMode: easyModeAfter } = nextProps;

        if (!easyModeAfter.busy && easyModeBefore.busy != easyModeAfter.busy) {
            this.props.findAllFiles();
        }
    }

    renderBusy() {
        return (
            <View>
                <Text style={textPanelStyle}>{i18n.t("easyMode.busy")}</Text>
                <KeepAwake />
            </View>
        );
    }

    renderMenu() {
        const { easyMode, executePlan, navigateWelcome, navigateEditDeviceName } = this.props;
        return (
            <ScrollView style={{ flex: 1, alignSelf: "stretch" }}>
                <DeviceOptions easyMode={easyMode} executePlan={executePlan} navigateEditDeviceName={navigateEditDeviceName} />

                <UploadQueueOptions easyMode={easyMode} executePlan={executePlan} />

                <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 20 }}>
                    <View
                        style={{
                            bottom: 0,
                            paddingLeft: 10,
                            paddingRight: 10,
                            width: "100%"
                        }}
                    >
                        <Button title={i18n.t("easyMode.advanced")} onPress={() => navigateWelcome()} />
                    </View>
                </View>
            </ScrollView>
        );
    }

    render() {
        const { easyMode } = this.props;
        return (
            <AppScreen backgroundStyle={{ height: "100%" }}>
                <Image
                    source={require("../../assets/fk-header.png")}
                    style={{
                        resizeMode: "contain",
                        width: "100%",
                        height: 200
                    }}
                />

                {easyMode.busy ? this.renderBusy() : this.renderMenu()}
            </AppScreen>
        );
    }
}

EasyModeScreen.propTypes = {
    deviceStartConnect: PropTypes.func.isRequired,
    executePlan: PropTypes.func.isRequired,
    findAllFiles: PropTypes.func.isRequired,
    deleteAllLocalFiles: PropTypes.func.isRequired,
    archiveAllLocalFiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    easyMode: {
        busy: !state.progress.task.done,
        networkConfiguration: state.networkConfiguration,
        devices: state.devices,
        plans: state.planning.plans
    }
});

export default connect(
    mapStateToProps,
    {
        findAllFiles,
        executePlan,
        deviceStartConnect,
        deleteAllLocalFiles,
        archiveAllLocalFiles,
        navigateWelcome,
        navigateEditDeviceName
    }
)(EasyModeScreen);
