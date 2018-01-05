'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from '../styles';

export default class DeviceInfo extends React.Component {
    render() {
        const { info } = this.props;

        return (
            <View>
                <Text style={styles.deviceInfo.name}>{info.name}</Text>
                <Text style={styles.deviceInfo.address}>{info.address}</Text>
            </View>
        );
    }
}
