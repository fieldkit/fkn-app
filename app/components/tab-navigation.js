import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import EasyModeScreen from "../containers/EasyModeScreen";
import BrowserScreen from "../containers/BrowserScreen";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { navigateEasyModeWelcome, browseDirectory, navigateBrowser, navigateAbout } from "../actions";

// Dummy Icon
class Icon extends React.Component {
    render() {
        return <View />;
    }
}

class Tab extends React.Component {
    render() {
        const { navigateEasyModeWelcome, browseDirectory, navigateAbout } = this.props;
        return (
            <View
                style={{
                    justifyContent: "flex-end",
                    paddingBottom: 2,
                    paddingTop: 5,
                    backgroundColor: "white"
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}
                >
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigateEasyModeWelcome();
                            }}
                        >
                            <Icon name="home" />
                            <Text> Sync </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                browseDirectory("/");
                            }}
                        >
                            <Icon name="rowing" />
                            <Text> Browser </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigateAbout();
                            }}
                        >
                            <Icon name="info" />
                            <Text> About </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({});

export default connect(
    mapStateToProps,
    {
        navigateEasyModeWelcome,
        navigateBrowser,
        browseDirectory,
        navigateAbout
    }
)(Tab);
