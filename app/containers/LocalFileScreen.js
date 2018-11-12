import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as Files from '../lib/files';

import { AppScreen, Loading, FileMenu } from '../components';

import { openLocalFile, uploadLocalFile, deleteLocalFile } from '../actions';

class LocalFileScreen extends React.Component {
    static navigationOptions = {
        title: 'File',
    };

    getFileEntry(path) {
        const { localFiles } = this.props;
        const listing = localFiles.listings[path];
        if (_.isArray(listing)) {
            return null;
        }
        const parentPath = Files.getParentPath(path);
        const parentListing = localFiles.listings[parentPath];
        if (!_.isArray(parentListing)) {
            return null;
        }
        return _.find(parentListing, (e) => e.relativePath == path);
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
        const { onOpen, onUpload, onDelete } = this.props;
        const { path } = this.props;

        const file = this.getFileEntry(path);
        if (!_.isObject(file)) {
            return <Loading />;
        }

        return (
            <AppScreen background={false}>
                <FileMenu file={file} onOpen={this.onOpen.bind(this)} onUpload={this.onUpload.bind(this)} onDelete={this.onDelete.bind(this)} />
            </AppScreen>
        );
    }
}

LocalFileScreen.propTypes = {
    path: PropTypes.string.isRequired,
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
    openLocalFile,
    uploadLocalFile,
    deleteLocalFile
})(LocalFileScreen);
