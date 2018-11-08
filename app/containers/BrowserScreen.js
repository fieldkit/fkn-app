import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AppScreen, DirectoryBrowser } from '../components';

import { navigateBack, navigateBrowser, browseDirectory, openLocalFile, uploadLocalFile, deleteLocalFile } from '../actions';

class BrowserScreen extends React.Component {
    static navigationOptions = {
        title: 'Browser',
    };

    constructor() {
        super();
    }

    onSelectEntry(entry) {
        this.props.browseDirectory(entry.relativePath);
    }

    onOpen(entry, parentEntry) {
        this.props.openLocalFile(entry.relativePath);
    }

    onUpload(entry, parentEntry) {
        this.props.uploadLocalFile(entry.relativePath);
    }

    onDelete(entry, parentEntry) {
        this.props.deleteLocalFile(entry.relativePath);
        this.onSelectEntry(parentEntry);
    }

    render() {
        const { path, localFiles } = this.props;

        return (
            <AppScreen background={false}>
                <DirectoryBrowser path={path} localFiles={localFiles} onSelectEntry={this.onSelectEntry.bind(this)} onUpload={this.onUpload.bind(this)} onDelete={this.onDelete.bind(this)} onOpen={this.onOpen.bind(this)} />
            </AppScreen>
        );
    }
}

BrowserScreen.propTypes = {
    path: PropTypes.string.isRequired,
    navigateBack: PropTypes.func.isRequired,
    navigateBrowser: PropTypes.func.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    uploadLocalFile: PropTypes.func.isRequired,
    openLocalFile: PropTypes.func.isRequired,
    deleteLocalFile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const route = state.nav.routes[state.nav.index];
    return {
        path: route.params ? route.params.path : "/",
        localFiles: state.localFiles,
    };
};

export default connect(mapStateToProps, {
    navigateBack,
    navigateBrowser,
    browseDirectory,
    openLocalFile,
    uploadLocalFile,
    deleteLocalFile
})(BrowserScreen);
