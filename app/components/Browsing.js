import _ from "lodash";
import moment from "moment";

import React from "react";
import PropTypes from "prop-types";
import { View, Text, ScrollView, FlatList, TouchableOpacity } from "react-native";

import * as Files from "../lib/files";

import { Loading } from "./Loading";
import { MenuButtonContainer, MenuButton } from "./MenuButtons";

import styles from "../styles";

export class DirectoryEntry extends React.Component {
    render() {
        const { style, entry, onSelect } = this.props;

        return (
            <TouchableOpacity onPress={() => onSelect(entry)}>
                <View style={style.container}>
                    {entry.directory && this.renderDirectory(entry)}
                    {!entry.directory && this.renderFile(entry)}
                </View>
            </TouchableOpacity>
        );
    }

    renderFile(entry) {
        const { style } = this.props;

        return (
            <View>
                <Text style={style.text}>
                    {entry.name} <Text style={{ fontSize: 12 }}>({entry.size})</Text>
                </Text>
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
    onSelect: PropTypes.func.isRequired
};

export class DirectoryListing extends React.Component {
    render() {
        const { path, parent, listing, onSelectEntry } = this.props;

        return (
            <View style={styles.browser.listing.container}>
                <View style={styles.browser.listing.path.container}>
                    <Text style={styles.browser.listing.path.text}>{Files.getPathName(path)}</Text>
                </View>

                {parent && <DirectoryEntry style={styles.browser.listing.back} entry={parent} onSelect={onSelectEntry} />}

                <FlatList style={{ marginBottom: 100 }}
                          data={listing}
                          keyExtractor={(entry, index) => index.toString()}
                          renderItem={({ item }) => <DirectoryEntry style={styles.browser.listing.entry} entry={item} onSelect={onSelectEntry} />}
                />
            </View>
        );
    }
}

DirectoryListing.propTypes = {
    path: PropTypes.string.isRequired,
    parent: PropTypes.object,
    listing: PropTypes.array.isRequired,
    onSelectEntry: PropTypes.func.isRequired
};

export class DirectoryBrowser extends React.Component {
    render() {
        const { path, localFiles, onSelectEntry } = this.props;

        const parent = Files.getParentEntry(path);
        const listing = localFiles.listings[path];

        if (!_.isArray(listing)) {
            return <Loading />;
        }

        return <DirectoryListing parent={parent} path={path} listing={listing} onSelectEntry={onSelectEntry} />;
    }
}

DirectoryBrowser.propTypes = {
    path: PropTypes.string.isRequired,
    localFiles: PropTypes.object.isRequired,
    onSelectEntry: PropTypes.func.isRequired
};
