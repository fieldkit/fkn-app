import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, Button, TextInput, ScrollView, AsyncStorage, Modal } from "react-native";

import { StackNavigator, addNavigationHelpers } from "react-navigation";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

import * as Files from "../lib/files";
import { AppScreen } from "../components";

import { navigateEasyModeWelcome, findAllFiles, executePlan, deviceStartConnect, deleteAllLocalFiles, archiveAllLocalFiles, navigateWelcome, configureName } from "../actions";

import styles from "../styles";

class EditDeviceName extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return { title: "Edit Device Name" };
    };

    state = {
        deviceName: "",
        modalVisible: false
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _addData = async (deviceId, text, address) => {
        const { configureName } = this.props;
        try {
            await AsyncStorage.setItem(deviceId, text);
            configureName(address, text);
            this.setState({ modalVisible: true });
        } catch (error) {
            console.log("error adding data", error);
        }
    };

    render() {
        const { deviceId, navigateEasyModeWelcome, address } = this.props;
        return (
            <View>
                <Modal animationType="slide" transparent={false} visible={this.state.modalVisible} onRequestClose={() => navigateEasyModeWelcome()}>
                    <View style={{ marginTop: 30 }}>
                        <View>
                            <Text> Device name has been saved! </Text>
                            <Button
                                title="Exit"
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            />
                        </View>
                    </View>
                </Modal>
                <TextInput style={{ height: 40, borderColor: "gray", borderWidth: 1 }} placeholder={"Device Name"} onChangeText={text => this.setState({ deviceName: text })} />
                <Button title="Save" onPress={() => this._addData(deviceId, this.state.deviceName, address)} />
                <Button title="Cancel" onPress={() => navigateEasyModeWelcome()} />
            </View>
        );
    }
}

EditDeviceName.propTypes = {
    deviceId: PropTypes.string.isRequired,
    navigateEasyModeWelcome: PropTypes.func.isRequired,
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
    const route = state.nav.routes[state.nav.index];
    return {
        deviceId: route.params ? route.params.deviceId : "",
        address: route.params ? route.params.address : null
    };
};

export default connect(
    mapStateToProps,
    {
        navigateEasyModeWelcome,
        configureName
    }
)(EditDeviceName);
