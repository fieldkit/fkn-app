import _ from 'lodash';
import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import * as Files from '../lib/files';

import { SmallButton, AppScreen, Loading, MenuButtonContainer, MenuButton } from '../components';

import styles from '../styles';

export class DirectoryEntry extends React.Component {
    render() {
        const { style, entry, onSelect } = this.props;

        return (
            <TouchableOpacity onPress={() => onSelect(entry) }>
                <View style={style.container}>
                    { entry.directory && <Text style={style.text}>{entry.name}</Text>}
                    {!entry.directory && <Text style={style.text}>{entry.name} <Text style={{ fontSize: 12 }}>({entry.size})</Text></Text>}
                </View>
            </TouchableOpacity>
        )
    }
}

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
                    data={listing}
                    keyExtractor={(entry, index) => index}
                    renderItem={({item}) => <DirectoryEntry style={styles.browser.listing.entry} entry={item} onSelect={onSelectEntry} />}
                    />
            </View>
        );
    }
}

export class FileMenu extends React.Component {
    render() {
        const { file, parent, onSelectEntry, onUpload, onDelete } = this.props;

        const parentEntry = Files.getParentEntry(file.relativePath);

        return (
            <View style={styles.browser.file.container}>
                {parent && <DirectoryEntry style={styles.browser.listing.back} entry={parent} onSelect={onSelectEntry} />}

                <View style={styles.browser.file.name.container}>
                    <Text style={styles.browser.file.name.text}>{file.name}</Text>
                </View>

                <MenuButtonContainer>
                    <MenuButton title="Upload" onPress={() => onUpload(file, parentEntry)} />
                    <MenuButton title="Delete" onPress={() => onDelete(file, parentEntry)} color="#E74C3C" />
                </MenuButtonContainer>
            </View>
        );
    }
}

export class DirectoryBrowser extends React.Component {
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

    render() {
        const { path, localFiles, onSelectEntry, onUpload, onDelete } = this.props;

        const file = this.getFileEntry(path);
        const parent = Files.getParentEntry(path);
        const listing = localFiles.listings[path];

        if (_.isObject(file)) {
            return <FileMenu file={file} parent={parent} onSelectEntry={onSelectEntry} onUpload={onUpload} onDelete={onDelete} />
        }

        if (!_.isArray(listing)) {
            return <Loading />;
        }

        return (
            <AppScreen background={false}>
                <DirectoryListing parent={parent} path={path} listing={listing} onSelectEntry={onSelectEntry} />
            </AppScreen>
        );
    }
}
