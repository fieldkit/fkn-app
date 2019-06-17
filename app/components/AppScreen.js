import React from "react";
import PropTypes from "prop-types";

import { View } from "react-native";
import RNLanguages from "react-native-languages";

import i18n from "../internationalization/i18n";
import Tab from "./tab-navigation";

// import { BackgroundView } from "./BackgroundView";

import ProgressHeader from "../containers/ProgressHeader";

import styles from "../styles";

//<View style={[styles.mainView, style]}>
//const { style, background, backgroundStyle } = this.props;

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

        // if (background === false) {
        //   return (
        //     <View>
        //       <View style={[styles.mainView, style]}>
        //         <ProgressHeader />
        //         {children}
        //       </View>
        //       <View style={{ justifyContent: "flex-end" }}>
        //         <Tab />
        //       </View>
        //     </View>
        //   );
        // }

        return (
            <View style={styles.mainView}>
                <ProgressHeader />
                {children}
                <Tab />
            </View>
        );
    }
}

AppScreen.propTypes = {
    background: PropTypes.bool
};
