import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, Button, TextInput, KeyboardAvoidingView, AsyncStorage } from "react-native";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

import * as Files from "../lib/files";
import { AppScreen } from "../components";

import { navigateWelcome, deviceStartConnect, findAllFiles, executePlan, deleteAllLocalFiles, archiveAllLocalFiles } from "../actions";

import styles from "../styles";

const textPanelStyle = {
    padding: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)"
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
    }

    render() {
        const { easyMode } = this.props;
        const { uploads } = easyMode.plans;

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
                    <Text style={textPanelStyle}>{i18n.t("easyMode.noPendingFiles")}</Text>
                </View>
            );
        }

        return (
            <View>
                <View>
                    <Text style={textPanelStyle}>
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
        deviceName: "",
        recognizedDevice: ""
    };

    componentDidMount = async () => {
        console.log("mounting");
        const easyMode = this.props;
        if (easyMode.devices) {
            console.log("passed");
            try {
                const value = await AsyncStorage.getItem(hexArrayBuffer(easyMode.devices["192.168.2.1"].capabilities.deviceId));
                console.log("THIS IS VALUE", value);
                this.setState({ recognizedDevice: value });
            } catch (error) {
                console.log(error);
            }
        }
    };

    componentWillUpdate = async (nextProps, nextState) => {
        console.log("updating in device options");
        const { easyMode: easyModeBefore } = this.props;
        const { easyMode: easyModeAfter } = nextProps;

        if (easyModeAfter.devices != easyModeBefore.devices) {
            try {
                const value = await AsyncStorage.getItem(hexArrayBuffer(easyModeAfter.devices["192.168.2.1"].capabilities.deviceId));
                console.log("THIS IS VALUE PT 2", value);
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

    _addData = async text => {
        const { easyMode } = this.props;
        const value = hexArrayBuffer(easyMode.devices["192.168.2.1"].capabilities.deviceId);
        try {
            await AsyncStorage.setItem(value, this.state.deviceName);
            // console.log("no error adding data");
        } catch (error) {
            console.log("error adding data", error);
        }
    };

    setDeviceName() {
        const { easyMode } = this.props;
        <View>
            <TextInput style={{ height: 40, borderColor: "gray", borderWidth: 1 }} placeholder={easyMode.devices.key} onChangeText={text => this.setState({ deviceName })} value={this.state.deviceName} />
        </View>;
    }

    render() {
        const { easyMode } = this.props;
        const { downloads } = easyMode.plans;
        const numberOfDevices = _.size(easyMode.devices);
        //console.log("THIS IS EASYMODE.DEVICES", easyMode.devices);
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
                        <Text style={{ padding: 10, textAlign: "center" }}>{i18n.t("easyMode.noDevicesConnect")}</Text>
                    </View>
                );
            } else {
                return (
                    <View style={textPanelStyle}>
                        <Text style={{ padding: 10, textAlign: "center" }}>{i18n.t("easyMode.noDevices")}</Text>
                    </View>
                );
            }
        }

        console.log("WILL RECOGNIZED DEVICE UPDATE?", this.state.recognizedDevice);
        if (this.state.recognizedDevice != "") {
            return (
                <View>
                    <Text style={textPanelStyle}>{this.state.recognizedDevice} was found.</Text>
                    <TextInput style={{ height: 40, borderColor: "gray", borderWidth: 1 }} placeholder={easyMode.devices.key} onChangeText={text => this.setState({ deviceName: text })} value={this.state.deviceName} />
                    <Button title="Reset Device Name" onPress={() => this._addData(this.state.deviceName)} />
                    <Button title={i18n.t("easyMode.syncPhone")} onPress={() => this.onSync()} />
                </View>
            );
        }

        return (
            <View>
                <View style={{ padding: 10 }}>
                    <Text style={textPanelStyle}>
                        {i18n.t("easyMode.devicesFound", {
                            numberOfDevices: numberOfDevices,
                            estimatedDownload: estimatedDownload
                        })}
                    </Text>
                    <Button title={i18n.t("easyMode.syncPhone")} onPress={() => this.onSync()} />
                    <View style={{ padding: 10 }}>
                        <TextInput style={{ height: 40, borderColor: "gray", borderWidth: 1 }} placeholder={easyMode.devices.key} onChangeText={text => this.setState({ deviceName: text })} value={this.state.deviceName} />
                        <Button title="Set Device Name" onPress={() => this._addData(this.state.deviceName)} />
                    </View>
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
    }

    componentWillUpdate(nextProps, nextState) {
        console.log("EASY MODE UPDATE");
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
            </View>
        );
    }

    renderMenu() {
        const { easyMode, executePlan, navigateWelcome } = this.props;
        return (
            <View style={{ flex: 1, alignSelf: "stretch" }}>
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <DeviceOptions easyMode={easyMode} executePlan={executePlan} />

                    <UploadQueueOptions easyMode={easyMode} executePlan={executePlan} />

                    <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 20 }}>
                        <View
                            style={{
                                bottom: 0,
                                position: "absolute",
                                paddingLeft: 10,
                                paddingRight: 10,
                                width: "100%"
                            }}
                        >
                            <Button title={i18n.t("easyMode.advanced")} onPress={() => navigateWelcome()} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
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
        navigateWelcome
    }
)(EasyModeScreen);
