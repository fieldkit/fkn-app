import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RNLanguages from "react-native-languages";

import i18n from "../internationalization/i18n";

import Config from "../config";

import { View, Text, Image } from "react-native";

import KeepAwake from "react-native-keep-awake";

import { AppScreen, MenuButtonContainer, Button } from "../components";

import ProgressHeader from "./ProgressHeader";

import { navigateWelcome, uploadLogs } from "../actions";

import { textStyle, title, subtitle, cardWrapper, cardStyle } from "../styles";

class AboutScreen extends React.Component {
    static navigationOptions = { header: null };

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

    renderAbout() {
        const { about, navigateWelcome, uploadLogs } = this.props;

        return (
            <View style={{ height: "92%" }}>
                <Text style={title}>About</Text>
                <View style={cardWrapper}>
                    <View style={cardStyle}>
                        <Image
                            source={require("../../assets/FieldkitAbout.jpg")}
                            style={{
                                resizeMode: "contain",
                                width: "100%",
                                height: 200
                            }}
                        />
                        <Text style={textStyle}>Use Fieldkit's low-cost, reliable sensors and compatible tools to tell compelling stories with data.</Text>
                    </View>
                </View>
                <View style={cardWrapper}>
                    <View style={cardStyle}>
                        <Text style={subtitle}>Tell us about any errors</Text>
                        <View style={{ alignItems: "center" }}>
                            <Button title="Upload Logs" onPress={() => uploadLogs()} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { about } = this.props;

        return <AppScreen>{about.busy ? this.renderBusy() : this.renderAbout()}</AppScreen>;
    }
}

AboutScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    about: {
        busy: !state.progress.task.done
    }
});

export default connect(
    mapStateToProps,
    {
        navigateWelcome,
        uploadLogs
    }
)(AboutScreen);
