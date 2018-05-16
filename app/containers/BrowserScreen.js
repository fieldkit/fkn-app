import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AppScreen, DirectoryBrowser } from '../components';

import { navigateBack, navigateBrowser, browseDirectory, uploadLocalFile, deleteLocalFile } from '../actions';

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
                <DirectoryBrowser path={path} localFiles={localFiles} onSelectEntry={this.onSelectEntry.bind(this)} onUpload={this.onUpload.bind(this)} onDelete={this.onDelete.bind(this)} />
            </AppScreen>
        );
    }
}

BrowserScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    navigateBrowser: PropTypes.func.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    localFiles: PropTypes.object.isRequired
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
    uploadLocalFile,
    deleteLocalFile
})(BrowserScreen);
