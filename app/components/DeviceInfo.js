import React from "react";
import { View, Text } from "react-native";

import styles from "../styles";

export class DeviceInfo extends React.Component {
    render() {
        const { info } = this.props;

        if (!info.name) {
            return <View />;
        }

        return (
            <View style={styles.deviceInfo.container}>
                <Text style={styles.deviceInfo.name}>{info.name}</Text>
                <View style={styles.deviceInfo.lineTwo}>
                    <Text style={styles.deviceInfo.address}>
                        {info.address}, {this.getUptime(info.status.uptime)},{" "}
                        {parseInt(info.status.batteryPercentage)}%
                    </Text>
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
            minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
            str += minutes + "M";
        }
        if (false) {
            str += " " + Math.floor(seconds) + "S";
        }
        str = str.trim();
        if (str.length == 0) {
            return "NA";
        }
        return str.trim();
    }
}
