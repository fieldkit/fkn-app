import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, TextInput, ScrollView, AsyncStorage, Modal } from "react-native";

import KeepAwake from "react-native-keep-awake";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

import * as Files from "../lib/files";
import { AppPermissions } from "../lib/permissions";

import { AppScreen, Button } from "../components";

import { navigateWelcome, navigateEditDeviceName, deviceStartConnect, findAllFiles, executePlan, deleteAllLocalFiles, archiveAllLocalFiles, configureName } from "../actions";

import Config from "../config";

import styles from "../styles";

// <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 20 }}>
//   <View>
//     <Button
//       title={i18n.t("easyMode.advanced")}
//       onPress={() => navigateWelcome()}
//     />
//   </View>
// </View>

const textPanelStyle = {
    paddingLeft: 15,
    paddingRight: 15,
    textAlign: "center"
};

const textStyle = {
    padding: 10,
    fontSize: 15,
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
                        fetch(Config.baseUri + "/devices/" + store[i][0], {
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
                <View>
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
                <View>
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

        console.log(numberOfDevices);
        if (numberOfDevices == 0 || !_.isArray(downloads) || downloads.length == 0) {
            if (!easyMode.networkConfiguration.deviceAp) {
                return (
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center" }} />
                        <Image
                            source={require("../../assets/fogg-no-comments.png")}
                            style={{
                                resizeMode: "contain",
                                width: "100%",
                                height: 250
                            }}
                        />
                        <View style={textPanelStyle}>
                            <Text style={textStyle}>{i18n.t("easyMode.noDevicesConnect")}</Text>
                        </View>
                        <Button
                            onPress={() => {
                                this.setState({ modalVisible: !this.state.modalVisible });
                            }}
                            title="Connect Device Guide"
                        />
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
                    <Image
                        source={require("../../assets/fieldkit_river.jpg")}
                        style={{
                            resizeMode: "contain",
                            width: "100%",
                            height: 250
                        }}
                    />
                    <Text style={textPanelStyle}>{this.state.recognizedDevice} was found.</Text>
                    <View
                        style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingBottom: 10,
                            width: "100%"
                        }}
                    >
                        <Button title="Edit Device Name" onPress={() => navigateEditDeviceName("deviceName" + hexArrayBuffer(easyMode.singleDevice.capabilities.deviceId), easyMode.singleDevice.address)} />
                    </View>
                    <Text style={textPanelStyle}>Syncing will download {estimatedDownload} bytes.</Text>
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

        if (numberOfDevices == 1 && _.toString(this.state.recognizedDevice) == "") {
            return (
                <View>
                    <Image
                        source={require("../../assets/fieldkit_river.jpg")}
                        style={{
                            resizeMode: "contain",
                            width: "100%",
                            height: 250
                        }}
                    />
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
                        <Button title="Set Device Name" onPress={() => navigateEditDeviceName(hexArrayBuffer(easyMode.singleDevice.capabilities.deviceId), easyMode.singleDevice.address)} />
                        <Button title={i18n.t("easyMode.syncPhone")} onPress={() => this.onSync()} />
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

class EasyModeScreen extends React.Component {
    static navigationOptions = {
        header: null
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
        const { easyMode, executePlan, navigateWelcome, navigateEditDeviceName, configureName } = this.props;

        const shadowStyle = {
            shadowOpacity: 0.5,
            shadowRadius: 20,
            shadowColor: "DidFinishRenderingFrameFully"
        };
        return (
            <ScrollView style={{ flex: 1, alignSelf: "stretch" }}>
                <View style={shadowStyle}>
                    <DeviceOptions easyMode={easyMode} executePlan={executePlan} navigateEditDeviceName={navigateEditDeviceName} configureName={configureName} />
                </View>

                <UploadQueueOptions easyMode={easyMode} executePlan={executePlan} />
            </ScrollView>
        );
    }

    render() {
        const { easyMode } = this.props;
        return (
            <AppScreen backgroundStyle={{ height: "100%" }}>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: 30
                    }}
                >
                    <Image
                        source={require("../../assets/FieldKit_Logo_blue.png")}
                        style={{
                            resizeMode: "contain",
                            width: "100%",
                            height: 50
                        }}
                    />
                </View>

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
    archiveAllLocalFiles: PropTypes.func.isRequired,
    configureName: PropTypes.func.isRequired
};

function getSingleDevice(state) {
    const devices = state.devices;
    const keys = _.keys(devices);
    if (keys.length != 1) {
        return null;
    }
    return devices[keys[0]];
}

const mapStateToProps = state => {
    return {
        easyMode: {
            busy: !state.progress.task.done,
            networkConfiguration: state.networkConfiguration,
            devices: state.devices,
            plans: state.planning.plans,
            singleDevice: getSingleDevice(state)
        }
    };
};

export default connect(
    mapStateToProps,
    {
        findAllFiles,
        executePlan,
        deviceStartConnect,
        deleteAllLocalFiles,
        archiveAllLocalFiles,
        navigateWelcome,
        navigateEditDeviceName,
        configureName
    }
)(EasyModeScreen);
