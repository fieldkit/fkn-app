import _ from "lodash";
import moment from "moment";

import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";

import * as Files from "../lib/files";

import { MenuButtonContainer, MenuButton } from "./MenuButtons";

import styles from "../styles";

export class FileMenu extends React.Component {
    render() {
        const { file, onOpen, onUpload, onDelete, onOpenDataMap } = this.props;
        const parentEntry = Files.getParentEntry(file.relativePath);
        const fileName = Files.getPathName(file.path);

        return (
            <View style={styles.browser.file.container}>
                <View style={styles.browser.file.name.container}>
                    <Text style={styles.browser.file.name.text}> {file.name} </Text>
                    <Text style={styles.browser.file.filename.text}> {fileName} </Text>
                    <Text style={styles.browser.file.size.text}> Size: {file.size} bytes. </Text>
                    <Text style={styles.browser.file.modified.text}> Modified: {file.modifiedPretty} </Text>
                </View>

                <MenuButtonContainer>
                    <MenuButton title="Open" onPress={() => onOpen(file, parentEntry)} />
                    <MenuButton title="Upload" onPress={() => onUpload(file, parentEntry)} />
                    {false && <MenuButton title="Map Data" onPress={() => onOpenDataMap(file, parentEntry)} />}
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
    onDelete: PropTypes.func.isRequired
};
