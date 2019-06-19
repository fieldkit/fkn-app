import React from "react";
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet } from "react-native";
import EasyModeScreen from "../containers/EasyModeScreen";
import BrowserScreen from "../containers/BrowserScreen";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { navigateEasyModeWelcome, browseDirectory, navigateBrowser, navigateAbout, navigateUpload } from "../actions";

const styles = StyleSheet.create({
    subtext: Platform.select({
        ios: {
            // Material design blue from https://material.google.com/style/color.html#color-color-palette
            color: "#6B6D6F",
            paddingBottom: 5
        },
        android: {
            color: "#6B6D6F"
        }
    }),
    imageSize: Platform.select({
        ios: {
            // Material design blue from https://material.google.com/style/color.html#color-color-palette
            resizeMode: "contain",
            width: "100%",
            height: 25
        },
        android: {
            resizeMode: "contain",
            width: "100%",
            height: 20
        }
    })
});

class Tab extends React.Component {
    const;
    render() {
        const { navigateEasyModeWelcome, browseDirectory, navigateAbout, navigateUpload } = this.props;
        const imageSize = [styles.imageSize];
        const subtext = [styles.subtext];
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    backgroundColor: "white",
                    elevation: 4
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
                            <Image source={require("../../assets/Icon_Device_active3x.png")} style={imageSize} />
                            <Text style={subtext}> Device </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigateUpload();
                            }}
                        >
                            <Image source={require("../../assets/Icon_sync_active3x.png")} style={imageSize} />
                            <Text style={subtext}> Upload </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                browseDirectory("/");
                            }}
                        >
                            <Image source={require("../../assets/Icon_files_active3x.png")} style={imageSize} />
                            <Text style={subtext}> Browser </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigateAbout();
                            }}
                        >
                            <Image source={require("../../assets/Icon_About_active3x.png")} style={imageSize} />
                            <Text style={subtext}> About </Text>
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
        navigateAbout,
        navigateUpload
    }
)(Tab);
