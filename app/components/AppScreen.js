import React from "react";
import PropTypes from "prop-types";

import { View } from "react-native";
import RNLanguages from "react-native-languages";

import i18n from "../internationalization/i18n";

import { BackgroundView } from "./BackgroundView";

import ProgressHeader from "../containers/ProgressHeader";

import styles from "../styles";

export class AppScreen extends React.Component {
    componentWillMount() {
        RNLanguages.addEventListener("change", this.onLanguageChange);
    }

    componentWillUnmount() {
        RNLanguages.removeEventListener("change", this.onLanguageChange);
    }

    onLanguageChange(language) {
        i18n.locale = language;
    }

    render() {
        const { style, background, backgroundStyle } = this.props;
        const { children } = this.props;

        if (background === false) {
            return (
                <View style={[styles.mainView, style]}>
                    <ProgressHeader />
                    {children}
                </View>
            );
        }

        return (
            <View style={styles.mainView}>
                <BackgroundView style={backgroundStyle}>
                    <ProgressHeader />
                    {children}
                </BackgroundView>
            </View>
        );
    }
}

AppScreen.propTypes = {
    background: PropTypes.bool
};
