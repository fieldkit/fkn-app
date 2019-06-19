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

import { isDeviceNameKey, getDeviceIdFromKey } from "./DeviceOptions";

import { textStyle, title, subtitle, cardWrapper, cardStyle } from "../styles";

export class UploadQueueOptions extends React.Component {
    setNamesOnServer() {
        return AsyncStorage.getAllKeys((err, keys) => {
            return AsyncStorage.multiGet(
                _(keys)
                    .filter(key => isDeviceNameKey(key))
                    .value(),
                (err, names) => {
                    return Promise.all(
                        _(names)
                            .map(value => {
                                console.log(value, key);
                                const [key, name] = value;
                                const deviceId = getDeviceIdFromKey(key);
                                return fetch(Config.baseUri + "/devices/" + deviceId, {
                                    method: "POST",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        deviceId: deviceId,
                                        name: name
                                    })
                                });
                            })
                            .value()
                    );
                }
            );
        }).then(huh => {
            console.log(huh);
        });
    }

    onSync() {
        const { easyMode, executePlan } = this.props;
        const { uploads } = easyMode.plans;

        executePlan(
            _(uploads)
                .map(r => r.plan)
                .flatten()
                .value()
        );

        this.setNamesOnServer();
    }

    renderNothingToUpload() {
        return (
            <View style={cardWrapper}>
                <View style={cardStyle}>
                    <Text style={textStyle}>{i18n.t("easyMode.noPendingFiles")}</Text>
                </View>
            </View>
        );
    }

    renderOnline(pending) {
        return (
            <View style={cardWrapper}>
                <View style={cardStyle}>
                    <Image
                        source={require("../../assets/Fieldkit_Upload.jpg")}
                        style={{
                            resizeMode: "contain",
                            width: "100%",
                            height: 200
                        }}
                    />
                    <View>
                        <Text style={textStyle}>
                            {i18n.t("easyMode.pendingFiles", {
                                numberOfFiles: pending.numberOfFiles,
                                estimatedUpload: pending.estimatedUpload
                            })}
                        </Text>
                    </View>
                    <View style={{ alignItems: "center", paddingTop: 10, paddingBottom: 10 }}>
                        <Button title={i18n.t("easyMode.syncServer")} onPress={() => this.onSync()} />
                    </View>
                </View>
            </View>
        );
    }

    renderOffline(pending) {
        return (
            <View style={cardWrapper}>
                <View style={cardStyle}>
                    <Image
                        source={require("../../assets/Fieldkit_Upload.jpg")}
                        style={{
                            resizeMode: "contain",
                            width: "100%",
                            height: 180
                        }}
                    />
                    <Text style={textStyle}>
                        {i18n.t("easyMode.pendingFiles", {
                            numberOfFiles: pending.numberOfFiles,
                            estimatedUpload: pending.estimatedUpload
                        })}{" "}
                        {i18n.t("easyMode.offline")}
                    </Text>
                </View>
            </View>
        );
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

        const pending = {
            numberOfFiles,
            estimatedUpload
        };

        if (numberOfFiles > 0) {
            if (networkConfiguration.internet.online) {
                return this.renderOnline(pending);
            }

            return this.renderOffline(pending);
        }

        return this.renderNothingToUpload();
    }
}
