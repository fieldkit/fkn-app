import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Image, ScrollView } from "react-native";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { AppScreen, MenuButtonContainer, MenuButton } from "../components";

import { initialize, navigateConnecting, browseDirectory, navigateBrowser, navigateEasyModeWelcome, navigateAbout, navigateMap, deviceStartConnect, deviceStopConnect, deleteAllLocalFiles, archiveAllLocalFiles, uploadLogs } from "../actions";

import styles from "../styles";

const buttonStyle = {
    backgroundColor: "#CE596B",
    alignItems: "center",
    padding: 10,
    borderRadius: 5
    // flex: 1,
    // justifyContent: "flex-end"
};

class WelcomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return { title: i18n.t("welcome.title") };
    };

    componentDidMount() {
        this.props.initialize();
        this.props.deviceStartConnect();
    }

    render() {
        const { navigateConnecting, browseDirectory, navigateEasyModeWelcome, navigateMap, navigateAbout, deleteAllLocalFiles, archiveAllLocalFiles, uploadLogs } = this.props;

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
                <MenuButtonContainer>
                    <MenuButton title={i18n.t("welcome.mode")} onPress={() => navigateEasyModeWelcome()} />
                    <MenuButton title={i18n.t("welcome.connect")} onPress={() => navigateConnecting()} />
                    <MenuButton title={i18n.t("welcome.browser")} onPress={() => browseDirectory("/")} />
                    <MenuButton title={i18n.t("welcome.uploadLogs")} onPress={() => uploadLogs()} />
                    {false && <MenuButton title={i18n.t("welcome.map")} onPress={() => navigateMap()} />}
                    {false && <MenuButton title={i18n.t("welcome.deleteAll")} onPress={() => deleteAllLocalFiles()} />}
                    {false && <MenuButton title={i18n.t("welcome.archiveAll")} onPress={() => archiveAllLocalFiles()} />}
                    {false && <MenuButton title={i18n.t("welcome.about")} onPress={() => navigateAbout()} />}
                </MenuButtonContainer>
            </AppScreen>
        );
    }
}

WelcomeScreen.propTypes = {
    initialize: PropTypes.func.isRequired,
    navigateConnecting: PropTypes.func.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    navigateEasyModeWelcome: PropTypes.func.isRequired,
    navigateAbout: PropTypes.func.isRequired,
    navigateMap: PropTypes.func.isRequired,
    deviceStartConnect: PropTypes.func.isRequired,
    uploadLogs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(
    mapStateToProps,
    {
        initialize,
        navigateConnecting,
        navigateEasyModeWelcome,
        navigateMap,
        navigateAbout,
        browseDirectory,
        deviceStartConnect,
        deleteAllLocalFiles,
        archiveAllLocalFiles,
        uploadLogs
    }
)(WelcomeScreen);
