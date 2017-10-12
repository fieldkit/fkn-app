'use strict';

import React, { Component } from 'react'
import { View, Button } from 'react-native'

import styles from '../styles';

export class MenuButtonContainer extends React.Component {
    render() {
        const { children } = this.props;

        return (
                <View style={styles.menuButtonContainer}>{children}</View>
        );
    }
}

export class MenuButton extends React.Component {
    render() {
        const { title, onPress } = this.props;

        return (
            <View style={styles.menuButton}><Button title={title} onPress={onPress} /></View>
        );
    }
}

export class SmallButton extends React.Component {
    render() {
        const { title, onPress } = this.props;

        return (
                <View style={{ width: 100 }}><Button title={title} onPress={onPress} /></View>
        );
    }
}
