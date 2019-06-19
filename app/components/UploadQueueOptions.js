import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, Image, TextInput, ScrollView, Modal } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import KeepAwake from "react-native-keep-awake";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { hexArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

import * as Files from "../lib/files";
import { AppPermissions } from "../lib/permissions";

import { AppScreen, Button } from "../components";

import { navigateWelcome, navigateEditDeviceName, deviceStartConnect, findAllFiles, executePlan, deleteAllLocalFiles, archiveAllLocalFiles, configureName } from "../actions";

import Config from "../config";

import { textStyle, textPanelStyle, title, subtitle, cardWrapper, cardStyle } from "../styles";

export class UploadQueueOptions extends React.Component {
    onSync() {
        const { easyMode, executePlan } = this.props;
        const { uploads } = easyMode.plans;

        executePlan(
            _(uploads)
                .map(r => r.plan)
                .flatten()
                .value()
        );
        if (false)
            try {
                AsyncStorage.getAllKeys((err, keys) => {
                    AsyncStorage.multiGet(keys, (err, stores) => {
                        stores.map((result, i, store) => {
                            fetch(Config.baseUri + "/devices/" + store[i][0], {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    deviceId: store[i][0],
                                    name: store[i][1]
                                })
                            });
                        });
                    });
                });
            } catch (error) {
                console.log(error);
            }
    }

    render() {
        const { easyMode } = this.props;
        const { uploads } = easyMode.plans;
        const { networkConfiguration } = easyMode;

        const numberOfFiles = _(uploads)
            .map(r => r.numberOfFiles)
            .sum();
        const estimatedUpload = _(uploads)
            .map(d => d.plan)
            .flatten()
            .filter(p => p.upload)
            .map(p => p.upload.uploading)
            .sum();

        if (numberOfFiles == 0) {
            return (
                <View style={cardWrapper}>
                    <View style={cardStyle}>
                        <Text style={textStyle}>{i18n.t("easyMode.noPendingFiles")}</Text>
                    </View>
                </View>
            );
        }

        if (!networkConfiguration.internet.online) {
            return (
                <View style={cardWrapper}>
                    <View style={cardStyle}>
                        <Text style={subtitle}>
                            {i18n.t("easyMode.pendingFiles", {
                                numberOfFiles: numberOfFiles,
                                estimatedUpload: estimatedUpload
                            })}{" "}
                            {i18n.t("easyMode.offline")}
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <View>
                <View>
                    <Text style={textStyle}>
                        {i18n.t("easyMode.pendingFiles", {
                            numberOfFiles: numberOfFiles,
                            estimatedUpload: estimatedUpload
                        })}
                    </Text>
                </View>
                <View style={{ padding: 10 }}>
                    <Button title={i18n.t("easyMode.syncServer")} onPress={() => this.onSync()} />
                </View>
            </View>
        );
    }
}
