'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { View } from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay';

import { BackgroundView } from '../components/BackgroundView';

import styles from '../styles';

export class AppScreen extends React.Component {
    render() {
        const { background } = this.props;
        const { children } = this.props;

        if (background === false) {
            return (
                <View style={styles.mainView}>
                    {children}
                    <Spinner visible={false} textContent={"Busy"} textStyle={{color: '#FFF'}} />
                </View>
            );
        }

        return (
            <View style={styles.mainView}>
                <BackgroundView>
                    {children}
                </BackgroundView>
                <Spinner visible={false} textContent={"Busy"} textStyle={{color: '#FFF'}} />
            </View>
        );
    }
}

AppScreen.propTypes = {
    background: PropTypes.bool,
};

