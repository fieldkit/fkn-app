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

class DirectoryEntry extends React.Component {
    render() {
        const { entry, onSelect } = this.props;

        return (
            <TouchableOpacity onPress={() => onSelect(entry) }>
                <View>
                    <Text style={{ height: 40, fontSize: 20, color: "black" }}>{entry.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

class DirectoryListing extends React.Component {
    render() {
        const { path, parent, listing, onSelectEntry } = this.props;

        return (
            <View>
                <View>
                    <Text style={{ height: 40, fontSize: 20, color: "black", fontWeight: 'bold' }}>{getPathName(path)}</Text>
                </View>
                {parent && <DirectoryEntry entry={parent} onSelect={onSelectEntry} />}
                <FlatList
                    data={listing}
                    keyExtractor={(entry, index) => index}
                    renderItem={({item}) => <DirectoryEntry entry={item} onSelect={onSelectEntry} />}
                    />
            </View>
        );
    }
}

class FileMenu extends React.Component {
    render() {
        const { file, parent, onSelectEntry } = this.props;

        return (
            <View>
                <DirectoryEntry entry={parent} onSelect={onSelectEntry} />

                <View>
                    <Text style={{ paddingLeft: 20, paddingRight: 20, height: 40, fontSize: 20, color: "black" }}>{file.name}</Text>
                </View>

                <MenuButtonContainer>
                    <MenuButton title="Upoad" onPress={() => console.log("Upoad")} />
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
        const parentPath = getParentPath(path);
        const parent = parentPath == null ? null : {
            name: 'UP',
            relativePath: parentPath,
            directory: true,
        };

        if (_.isObject(file)) {
            return <FileMenu file={file} parent={parentPath} onSelectEntry={this.onSelectEntry.bind(this)} />
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
