import _ from "lodash";

import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { AppScreen, DirectoryBrowser } from "../components";

import { navigateBrowser, browseDirectory, browseFile } from "../actions";

import { textStyle, title, subtitle, cardWrapper, cardStyle } from "../styles";

class BrowserScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    onSelectEntry(entry) {
        if (entry.directory) {
            this.props.browseDirectory(entry.relativePath);
        } else {
            this.props.browseFile(entry.relativePath);
        }
    }

    render() {
        const { path, localFiles } = this.props;

        return (
            <AppScreen>
                <View style={{ height: "92%" }}>
                    <Text style={title}>Browser</Text>
                    <View style={{ paddingTop: 15 }}>
                        <DirectoryBrowser path={path} localFiles={localFiles} onSelectEntry={this.onSelectEntry.bind(this)} />
                    </View>
                </View>
            </AppScreen>
        );
    }
}

BrowserScreen.propTypes = {
    path: PropTypes.string.isRequired,
    navigateBrowser: PropTypes.func.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    browseFile: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    const route = state.nav.routes[state.nav.index];
    return {
        path: route.params ? route.params.path : "/",
        localFiles: state.localFiles
    };
};

export default connect(
    mapStateToProps,
    {
        navigateBrowser,
        browseDirectory,
        browseFile
    }
)(BrowserScreen);
