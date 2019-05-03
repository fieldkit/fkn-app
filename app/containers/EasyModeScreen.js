import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, Button } from "react-native";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

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
        const { easyMode } = this.props;
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

        return (
            <View>
                <View>
                    <Text style={textPanelStyle}>
                        {i18n.t("easyMode.devicesFound", {
                            numberOfDevices: numberOfDevices,
                            estimatedDownload: estimatedDownload
                        })}
                    </Text>
                </View>
                <View style={{ padding: 10 }}>
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
            </View>
        );
    }

    renderMenu() {
        const { easyMode, executePlan, navigateWelcome } = this.props;

        return (
            <View style={{ flex: 1, alignSelf: "stretch" }}>
                <DeviceOptions easyMode={easyMode} executePlan={executePlan} />

                <UploadQueueOptions easyMode={easyMode} executePlan={executePlan} />

                <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 20 }}>
                    <View style={{ bottom: 0, position: "absolute", paddingLeft: 10, paddingRight: 10, width: "100%" }}>
                        <Button title={i18n.t("easyMode.advanced")} onPress={() => navigateWelcome()} />
                    </View>
                </View>
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
