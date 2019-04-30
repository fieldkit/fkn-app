import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import * as Files from "../lib/files";

import { AppScreen, Loading, FileMenu, MenuButton } from "../components";

import {
  browseDirectory,
  openLocalFile,
  uploadLocalFile,
  deleteLocalFile,
  openDataMap
} from "../actions";

class LocalFileScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
    return { title: i18n.t("localFile.title") };
    };

    onOpen(entry, parentEntry) {
        this.props.openLocalFile(entry.relativePath);
    }

    onUpload(entry, parentEntry) {
        this.props.uploadLocalFile(entry.relativePath);
    }

    onDelete(entry, parentEntry) {
        this.props.deleteLocalFile(entry.relativePath);
        this.props.browseDirectory(parentEntry.relativePath);
    }

  onOpenDataMap(entry, parentEntry) {
    this.props.openDataMap(entry.relativePath);
  }

    render() {
    const { onOpen, onUpload, onDelete, navigateDataMap } = this.props;
        const { localFiles, path } = this.props;

        const file = Files.getFileEntry(localFiles, path);
        if (!_.isObject(file)) {
            return <Loading />;
        }

        return (
            <AppScreen background={false}>
        <FileMenu
          file={file}
          onOpenDataMap={this.onOpenDataMap.bind(this)}
          onOpen={this.onOpen.bind(this)}
          onUpload={this.onUpload.bind(this)}
          onDelete={this.onDelete.bind(this)}
        />
            </AppScreen>
        );
    }
}

LocalFileScreen.propTypes = {
    path: PropTypes.string.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    uploadLocalFile: PropTypes.func.isRequired,
    openLocalFile: PropTypes.func.isRequired,
  deleteLocalFile: PropTypes.func.isRequired
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
    deleteLocalFile
})(LocalFileScreen);
