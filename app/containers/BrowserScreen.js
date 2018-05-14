import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import { SmallButton, AppScreen, Loading, MenuButtonContainer, MenuButton } from '../components';

import { navigateBack, browseDirectory } from '../actions';

import styles from '../styles';

function getPathName(path) {
    if (path == '/') {
        return '/';
    }
    const parts = path.split("/");
    return parts.pop();
}

function getParentPath(path) {
    if (path == "/") {
        return null;
    }
    const parts = path.split("/");
    parts.pop();
    if (parts.length <= 1) {
        return "/";
    }
    return parts.join("/");
}

function getParentEntry(path) {
    const parentPath = getParentPath(path);
    if (parentPath == null) {
        return null;
    }
    const baseName = getPathName(parentPath);
    return {
        directory: true,
        relativePath: parentPath,
        name: "Back" // "Back to " + baseName
    };
}

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
                    <Text style={styles.browser.listing.path.text}>{getPathName(path)}</Text>
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
        const { file, parent, onSelectEntry } = this.props;

        return (
            <View style={styles.browser.file.container}>
                {parent && <DirectoryEntry style={styles.browser.listing.back} entry={parent} onSelect={onSelectEntry} />}

                <View style={styles.browser.file.name.container}>
                    <Text style={styles.browser.file.name.text}>{file.name}</Text>
                </View>

                <MenuButtonContainer>
                    <MenuButton title="Upload" onPress={() => console.log("Upload")} />
                    <MenuButton title="Delete" onPress={() => console.log("Delete")} />
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
        this.state = {
            path: '/'
        };
    }

    componentWillMount() {
        const { path } = this.state;

        this.props.browseDirectory(path);
    }

    onSelectEntry(entry) {
        if (entry.directory) {
            this.props.browseDirectory(entry.relativePath);
        }

        this.setState({
            path: entry.relativePath,
        });
    }

    getFileEntry(path) {
        const { localFiles } = this.props;
        const listing = localFiles.listings[path];
        if (_.isArray(listing)) {
            return null;
        }
        const parentPath = getParentPath(path);
        const parentListing = localFiles.listings[parentPath];
        if (!_.isArray(parentListing)) {
            return null;
        }
        return _.find(parentListing, (e) => e.relativePath == path);
    }

    render() {
        const { progress, localFiles } = this.props;
        const { path } = this.state;

        const file = this.getFileEntry(path);
        const listing = localFiles.listings[path];
        const parent = getParentEntry(path);

        if (_.isObject(file)) {
            return <FileMenu file={file} parent={parent} onSelectEntry={this.onSelectEntry.bind(this)} />
        }

        if (!_.isArray(listing)) {
            return <Loading />;
        }

        return (
            <AppScreen progress={progress} background={false}>
                <DirectoryListing parent={parent} path={path} listing={listing} onSelectEntry={this.onSelectEntry.bind(this)} />
            </AppScreen>
        );
    }
}

BrowserScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    progress: PropTypes.object.isRequired,
    localFiles: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    progress: state.progress,
    localFiles: state.localFiles,
});

export default connect(mapStateToProps, {
    navigateBack,
    browseDirectory
})(BrowserScreen);
