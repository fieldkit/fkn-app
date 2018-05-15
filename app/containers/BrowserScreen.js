import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import * as Files from '../lib/files';

import { SmallButton, AppScreen, Loading, MenuButtonContainer, MenuButton } from '../components';

import { navigateBack, navigateBrowser, browseDirectory, uploadLocalFile, deleteLocalFile } from '../actions';

import styles from '../styles';

class DirectoryEntry extends React.Component {
    render() {
        const { style, entry, onSelect } = this.props;

        return (
            <TouchableOpacity onPress={() => onSelect(entry) }>
                <View style={style.container}>
                    <Text style={style.text}>{entry.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

class DirectoryListing extends React.Component {
    render() {
        const { path, parent, listing, onSelectEntry } = this.props;

        return (
            <View style={styles.browser.listing.container}>
                {parent && <DirectoryEntry style={styles.browser.listing.back} entry={parent} onSelect={onSelectEntry} />}

                <View style={styles.browser.listing.path.container}>
                    <Text style={styles.browser.listing.path.text}>{Files.getPathName(path)}</Text>
                </View>

                <FlatList
                    data={listing}
                    keyExtractor={(entry, index) => index}
                    renderItem={({item}) => <DirectoryEntry style={styles.browser.listing.entry} entry={item} onSelect={onSelectEntry} />}
                    />
            </View>
        );
    }
}

class FileMenu extends React.Component {
    render() {
        const { file, parent, onSelectEntry, onUpload, onDelete } = this.props;

        return (
            <View style={styles.browser.file.container}>
                {parent && <DirectoryEntry style={styles.browser.listing.back} entry={parent} onSelect={onSelectEntry} />}

                <View style={styles.browser.file.name.container}>
                    <Text style={styles.browser.file.name.text}>{file.name}</Text>
                </View>

                <MenuButtonContainer>
                    <MenuButton title="Upload" onPress={() => onUpload(file)} />
                    <MenuButton title="Delete" onPress={() => onDelete(file)} />
                </MenuButtonContainer>
            </View>
        );
    }
}

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

    onUpload(entry) {
        this.props.uploadLocalFile(entry.relativePath);
    }

    onDelete(entry) {
        this.props.deleteLocalFile(entry.relativePath);
        this.onSelectEntry(Files.getParentEntry(entry.relativePath));
    }

    render() {
        const { path, localFiles } = this.props;

        const file = this.getFileEntry(path);
        const parent = Files.getParentEntry(path);
        const listing = localFiles.listings[path];

        if (_.isObject(file)) {
            return <FileMenu file={file} parent={parent} onSelectEntry={this.onSelectEntry.bind(this)} onUpload={this.onUpload.bind(this)} onDelete={this.onDelete.bind(this)} />
        }

        if (!_.isArray(listing)) {
            return <Loading />;
        }

        return (
            <AppScreen background={false}>
                <DirectoryListing parent={parent} path={path} listing={listing} onSelectEntry={this.onSelectEntry.bind(this)} />
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
