'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from '../styles';

export class DeviceInfo extends React.Component {
    render() {
        const { info } = this.props;

        return (
            <View style={styles.deviceInfo.container}>
                <Text style={styles.deviceInfo.name}>{info.name}</Text>
                <View style={styles.deviceInfo.lineTwo}>
                    <Text style={styles.deviceInfo.address}>{info.address}</Text>
                    <Text style={styles.deviceInfo.uptime}>{this.getUptime(info.status.uptime)}</Text>
                    <Text style={styles.deviceInfo.battery}>{parseInt(info.status.batteryPercentage)}%</Text>
                </View>
            </View>
        );
    }

    getUptime(ms) {
        let seconds = ms / 1000;

        let str = "";
        let hours = 0;
        if (seconds > 60 * 60) {
            hours = Math.floor(seconds / (60 * 60));
            seconds -= hours * (60 * 60);
            str += hours + "H ";
        }
        let minutes = 0;
        if (seconds > 60) {
            minutes = Math.floor(seconds / (60));
            seconds -= minutes * (60);
            str += minutes + "M ";
        }
        str += Math.floor(seconds) + "S";
        return str;
    }
}
