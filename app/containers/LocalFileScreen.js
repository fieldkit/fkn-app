import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import * as Files from "../lib/files";

import { Image, Text, View, TouchableOpacity, Row } from "react-native";
import { AppScreen, Loading, FileMenu, MenuButton } from "../components";

import { browseDirectory, openLocalFile, uploadLocalFile, deleteLocalFile, openDataMap, navigateBack } from "../actions";
import { title } from "../styles";

class LocalFileScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    onOpen(entry, parentEntry) {
        this.props.openLocalFile(entry.relativePath);
    }

    onUpload(entry, parentEntry) {
        this.props.uploadLocalFile(entry.relativePath);
    }

    onDelete(entry, parentEntry) {
        this.props.deleteLocalFile(entry.relativePath);
        this.props.navigateBack();
    }

    onOpenDataMap(entry, parentEntry) {
        this.props.openDataMap(entry.relativePath);
    }

    render() {
        const { onOpen, onUpload, onDelete, navigateDataMap, browseDirectory } = this.props;
        const { localFiles, path } = this.props;

        const file = Files.getFileEntry(localFiles, path);
        if (!_.isObject(file)) {
            return <Loading />;
        }

        return (
            <AppScreen>
                <View style={{ height: "92%" }}>
                    <View
                        style={{
                            alignItems: "flex-start",
                            paddingTop: 20,
                            paddingLeft: 20
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                browseDirectory("/");
                            }}
                        >
                            <Text style={{ color: "#1B80C9" }}> Go Back</Text>
                        </TouchableOpacity>
                    </View>
                    <FileMenu file={file} onOpenDataMap={this.onOpenDataMap.bind(this)} onOpen={this.onOpen.bind(this)} onUpload={this.onUpload.bind(this)} onDelete={this.onDelete.bind(this)} />
                </View>
            </AppScreen>
        );
    }
}

LocalFileScreen.propTypes = {
    path: PropTypes.string.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    uploadLocalFile: PropTypes.func.isRequired,
    openLocalFile: PropTypes.func.isRequired,
    deleteLocalFile: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired
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
        browseDirectory,
        openLocalFile,
        uploadLocalFile,
        deleteLocalFile,
        navigateBack
    }
)(LocalFileScreen);
