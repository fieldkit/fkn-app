import React from 'react';
import PropTypes from 'prop-types';

import { View, Button } from 'react-native';

import { BackgroundView } from './BackgroundView';

import ProgressHeader from '../containers/ProgressHeader';

import styles from '../styles';

export class AppScreen extends React.Component {
    render() {
        const { style, background } = this.props;
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
                <BackgroundView>
                    <ProgressHeader />
                    {children}
                </BackgroundView>
            </View>
        );
    }
}

AppScreen.propTypes = {
    background: PropTypes.bool,
};

