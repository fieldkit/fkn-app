import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, Button, TextInput, ScrollView, AsyncStorage } from "react-native";

import { StackNavigator, addNavigationHelpers } from "react-navigation";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

import * as Files from "../lib/files";
import { AppScreen } from "../components";

import { navigateEasyModeWelcome, deviceStartConnect, findAllFiles, executePlan } from "../actions";

import styles from "../styles";

class EditDeviceName extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return { title: "Edit Device Name" };
    };

    state = {
        deviceName: "",
        recognizedDevice: ""
    };

    _addData = async (deviceId, text) => {
        console.log("THIS IS NAVIGAION", deviceId);
        try {
            await AsyncStorage.setItem(deviceId, this.state.deviceName);
            console.log("no error adding data");
        } catch (error) {
            console.log("error adding data", error);
        }
        return (
            <View>
                <Text>New device name saved.</Text>
            </View>
        );
    };

    render() {
        const { deviceId, navigateEasyModeWelcome } = this.props;
        console.log("THIS IS NAVIGAION", deviceId);
        return (
            <View>
                <TextInput style={{ height: 40, borderColor: "gray", borderWidth: 1 }} placeholder={"Device Name"} onChangeText={text => this.setState({ deviceName: text })} value={this.props.recognizedDevice} />
                <Button title="Save" onPress={() => this._addData(deviceId, this.state.deviceName)} />
                <Button title="Cancel" onPress={() => navigateEasyModeWelcome()} />
            </View>
        );
    }
}

EditDeviceName.propTypes = {
    deviceId: PropTypes.string.isRequired
};

const mapStateToProps = state => {
    const route = state.nav.routes[state.nav.index];
    console.log("Route", route);
    return {
        deviceId: route.params ? route.params.deviceId : ""
    };
};

export default connect(
    mapStateToProps,
    {
        navigateEasyModeWelcome
    }
)(EditDeviceName);
