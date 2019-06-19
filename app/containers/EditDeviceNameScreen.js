import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, TextInput, Modal } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { Toasts } from "../lib/toasts";

import { AppScreen, Button } from "../components";

import { navigateBack, configureName } from "../actions";

import styles from "../styles";

//add a prefix device name

class EditDeviceName extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return { title: "Edit Device Name" };
    };

    constructor() {
        super();
        this.state = {
            name: ""
        };
    }

    async componentWillMount() {
        const name = await AsyncStorage.getItem(this.props.deviceId);
        this.setState({
            name: name
        });
    }

    _addData = async (deviceId, text, address) => {
        if (text == "") {
            Toasts.show("Must input a name");
        } else {
            const { configureName } = this.props;
            try {
                await AsyncStorage.setItem(deviceId, text);
                configureName(address, text);
                Toasts.show("Your device name has been saved!");
                this.props.navigateBack();
            } catch (error) {
                console.log("error adding data", error);
            }
        }
    };

    render() {
        const { deviceId, navigateBack, address } = this.props;
        return (
            <View>
                <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                    <TextInput style={{ height: 40, borderColor: "gray", borderWidth: 1 }} placeholder={"Device Name"} onChangeText={text => this.setState({ name: text })} value={this.state.name} />
                </View>
                <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                    <Button title="Save" onPress={() => this._addData(deviceId, this.state.name, address)} />
                </View>
                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <Button title="Cancel" onPress={() => navigateBack()} />
                </View>
            </View>
        );
    }
}

EditDeviceName.propTypes = {
    deviceId: PropTypes.string.isRequired,
    navigateBack: PropTypes.func.isRequired,
    configureName: PropTypes.func.isRequired
};

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
        navigateBack,
        configureName
    }
)(EditDeviceName);
