'use strict';

import React, { Component } from 'react'
import { View, Button } from 'react-native'

import styles from '../styles';

export class SmallButton extends React.Component {
    render() {
        const { title, onPress } = this.props;

        return (
                <View style={{ width: 100 }}><Button title={title} onPress={onPress} /></View>
        );
    }
}
