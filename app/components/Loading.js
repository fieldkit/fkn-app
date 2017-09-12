'use strict';

import React, { Component } from 'react'

import { View, Text } from 'react-native'
import styles from '../styles';

export default class Loading extends React.Component {
    render() {
        return (
            <View>
                <Text style={styles.loading}>Loading...</Text>
            </View>
        );
    }
}
