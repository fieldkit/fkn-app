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

import { textStyle, title, subtitle, cardWrapper, cardStyle } from "../styles";

import { DeviceOptions } from "../components/DeviceOptions";

import ProgressHeader from "./ProgressHeader";

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
            <View style={cardWrapper}>
                <View style={cardStyle}>
                    <Text style={textStyle}>{i18n.t("easyMode.busy")}</Text>
                    <KeepAwake />
                    <ProgressHeader />
                </View>
            </View>
        );
    }

    renderMenu() {
        const { easyMode, executePlan, navigateWelcome, navigateEditDeviceName, configureName } = this.props;

        return (
            <View>
                <DeviceOptions easyMode={easyMode} executePlan={executePlan} navigateEditDeviceName={navigateEditDeviceName} configureName={configureName} />
            </View>
        );
    }

    render() {
        const { easyMode } = this.props;
        return (
            <AppScreen>
                <View style={{ height: "92%" }}>
                    <Text
                        style={{
                            fontSize: 40,
                            fontWeight: "bold",
                            color: "#1B80C9",
                            paddingTop: 30,
                            paddingLeft: 20
                        }}
                    >
                        FieldKit{" "}
                    </Text>

                    {easyMode.busy ? this.renderBusy() : this.renderMenu()}
                </View>
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
