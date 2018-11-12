import _ from 'lodash';
import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';

import * as Files from '../lib/files';

import { SmallButton, AppScreen, Loading, MenuButtonContainer, MenuButton } from '../components';

import styles from '../styles';

export class DirectoryEntry extends React.Component {
    render() {
        const { style, entry, onSelect } = this.props;

        return (
            <TouchableOpacity onPress={() => onSelect(entry)}>
                <View style={style.container}>
                { entry.directory && this.renderDirectory(entry)}
                {!entry.directory && this.renderFile(entry)}
                </View>
            </TouchableOpacity>
        );
    }

    renderFile(entry) {
        const { style } = this.props;

        return (
            <View>
              <Text style={style.text}>{entry.name} <Text style={{ fontSize: 12 }}>({entry.size})</Text></Text>
              <Text style={style.modified}>{entry.modifiedPretty}</Text>
            </View>
        );
    }

    renderDirectory(entry) {
        const { style } = this.props;
        return <Text style={style.text}>{entry.name}</Text>;
    }
}

DirectoryEntry.propTypes = {
    style: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export class DirectoryListing extends React.Component {
    render() {
        const { path, parent, listing, onSelectEntry } = this.props;

        return (
            <View style={styles.browser.listing.container}>
                {parent && <DirectoryEntry style={styles.browser.listing.back} entry={parent} onSelect={onSelectEntry} />}

                <View style={styles.browser.listing.path.container}>
                    <Text style={styles.browser.listing.path.text}>{Files.getPathName(path)}</Text>
                </View>

              <FlatList
                style={{ marginBottom: 100 }}
                    data={listing}
                    keyExtractor={(entry, index) => index.toString()}
                    renderItem={({item}) => <DirectoryEntry style={styles.browser.listing.entry} entry={item} onSelect={onSelectEntry} />}
                    />
            </View>
        );
    }
}

DirectoryListing.propTypes = {
    path: PropTypes.string.isRequired,
    parent: PropTypes.object,
    listing: PropTypes.array.isRequired,
    onSelectEntry: PropTypes.func.isRequired,
};

export class FileMenu extends React.Component {
    render() {
        const { file, onOpen, onUpload, onDelete } = this.props;

        const parentEntry = Files.getParentEntry(file.relativePath);

        return (
            <View style={styles.browser.file.container}>
                <View style={styles.browser.file.name.container}>
                    <Text style={styles.browser.file.name.text}>{file.name}</Text>
                    <Text style={styles.browser.file.size.text}>Size: {file.size} bytes.</Text>
                    <Text style={styles.browser.file.modified.text}>Modified: {file.modifiedPretty}</Text>
                </View>

                <MenuButtonContainer>
                    <MenuButton title="Open" onPress={() => onOpen(file, parentEntry)} />
                    <MenuButton title="Upload" onPress={() => onUpload(file, parentEntry)} />
                    <MenuButton title="Delete" onPress={() => onDelete(file, parentEntry)} color="#E74C3C" />
                </MenuButtonContainer>
            </View>
        );
    }
}

FileMenu.propTypes = {
    file: PropTypes.object.isRequired,
    onOpen: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export class DirectoryBrowser extends React.Component {
    render() {
        const { path, localFiles, onSelectEntry } = this.props;

        const parent = Files.getParentEntry(path);
        const listing = localFiles.listings[path];

        if (!_.isArray(listing)) {
            return <Loading />;
        }

        return (
            <DirectoryListing parent={parent} path={path} listing={listing} onSelectEntry={onSelectEntry} />
        );
    }
}

DirectoryBrowser.propTypes = {
    path: PropTypes.string.isRequired,
    localFiles: PropTypes.object.isRequired,
    onSelectEntry: PropTypes.func.isRequired,
};
