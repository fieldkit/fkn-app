import React from "react";
import PropTypes from "prop-types";

import { View, SafeAreaView } from "react-native";
import RNLanguages from "react-native-languages";

import i18n from "../internationalization/i18n";
import Tab from "./tab-navigation";

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
        const { style } = this.props;
        const { children } = this.props;

        return (
            <View style={styles.mainView}>
                <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
                    <View style={{ backgroundColor: "#F4F5F7" }}>{children}</View>
                    <Tab />
                </SafeAreaView>
            </View>
        );
    }
}

AppScreen.propTypes = {
    background: PropTypes.bool
};
