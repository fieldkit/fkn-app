import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import EasyModeScreen from "../containers/EasyModeScreen";
import BrowserScreen from "../containers/BrowserScreen";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { navigateEasyModeWelcome, browseDirectory, navigateBrowser, navigateAbout, navigateUpload } from "../actions";

class Tab extends React.Component {
    render() {
        const { navigateEasyModeWelcome, browseDirectory, navigateAbout, navigateUpload } = this.props;
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
                            <Image
                                source={require("../../assets/Icon_Device_active3x.png")}
                                style={{
                                    resizeMode: "contain",
                                    width: "100%",
                                    height: 20
                                }}
                            />
                            <Text style={{ color: "#6B6D6F" }}> Device </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigateUpload();
                            }}
                        >
                            <Image
                                source={require("../../assets/Icon_sync_active3x.png")}
                                style={{
                                    resizeMode: "contain",
                                    width: "100%",
                                    height: 20
                                }}
                            />
                            <Text style={{ color: "#6B6D6F" }}> Upload </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                browseDirectory("/");
                            }}
                        >
                            <Image
                                source={require("../../assets/Icon_files_active3x.png")}
                                style={{
                                    resizeMode: "contain",
                                    width: "100%",
                                    height: 20
                                }}
                            />
                            <Text style={{ color: "#6B6D6F" }}> Browser </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigateAbout();
                            }}
                        >
                            <Image
                                source={require("../../assets/Icon_About_active3x.png")}
                                style={{
                                    resizeMode: "contain",
                                    width: "100%",
                                    height: 20
                                }}
                            />
                            <Text style={{ color: "#6B6D6F" }}> About </Text>
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
