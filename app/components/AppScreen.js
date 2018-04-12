'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import { BackgroundView } from './BackgroundView';
import { ProgressBar } from './ProgressBar';

import styles from '../styles';

class ProgressHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            dismissed: false
        };
    }

    render() {
        const { progress } = this.props;

        if (progress.done) {
            return null;
        }

        return (
            <View>
                <ProgressBar progress={progress.progress * 100} />
            </View>
        );
    }
}

ProgressHeader.propTypes = {
    progress: PropTypes.object.isRequired
};

export class AppScreen extends React.Component {
    render() {
        const { background, progress, style } = this.props;
        const { children } = this.props;

        if (background === false) {
            return (
                <View style={[styles.mainView, style]}>
                    <ProgressHeader progress={progress.download} />
                    {children}
                </View>
            );
        }

        return (
            <View style={styles.mainView}>
                <BackgroundView>
                    <ProgressHeader progress={progress.download} />
                    {children}
                </BackgroundView>
            </View>
        );
    }
}

AppScreen.propTypes = {
    progress: PropTypes.object.isRequired,
    background: PropTypes.bool,
};

