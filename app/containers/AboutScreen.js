import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RNLanguages from "react-native-languages";

import i18n from "../internationalization/i18n";

import Config from "../config";

import { View, Text, Image } from "react-native";

import { AppScreen, MenuButtonContainer, Button } from "../components";

import { navigateWelcome, uploadLogs } from "../actions";

const textStyle = {
    padding: 10,
    textAlign: "center"
};

class AboutScreen extends React.Component {
    static navigationOptions = { header: null };

    render() {
        const { navigateWelcome } = this.props;
        return (
            <AppScreen>
                <View style={{ height: "91%" }}>
                    <View style={{ paddingTop: 50, paddingBottom: 20 }}>
                        <Image
                            source={require("../../assets/FieldkitAbout.jpg")}
                            style={{
                                resizeMode: "contain",
                                width: "100%",
                                height: 280
                            }}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 15,
                                paddingLeft: 15,
                                paddingRight: 15,
                                textAlign: "center"
                            }}
                        >
                            Use Fieldkit's low-cost, reliable sensors and compatible tools to tell compelling stories with data.
                        </Text>
                        <Button title="Upload Logs" onPress={() => uploadLogs()} />
                    </View>
                </View>
            </AppScreen>
        );
    }
}

AboutScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(
    mapStateToProps,
    {
        navigateWelcome,
        uploadLogs
    }
)(AboutScreen);
