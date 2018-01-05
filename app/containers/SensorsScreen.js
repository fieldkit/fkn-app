'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import {
    View,
    ScrollView,
    Text,
    Button
} from 'react-native'

import { BackgroundView } from '../components/BackgroundView';

import { navigateBack } from '../actions/navigation';

import Loading from '../components/Loading';

import styles from '../styles';

class SensorsScreen extends React.Component {
    static navigationOptions = {
        title: 'Sensors',
    };

    componentWillMount() {
    }

    render() {
        const { deviceStatus, deviceCapabilities } = this.props;

        return (
            <ScrollView>
                <View>
                    <Text style={styles.deviceName}>{deviceCapabilities.name}</Text>
                    <Text style={styles.deviceAddress}>{deviceStatus.connected.host}</Text>
                </View>
                {deviceCapabilities.sensors.map((s, i) => this.renderSensor(s, i))}
            </ScrollView>
        );
    }

    renderSensor(sensor, id) {
        return (
            <View key={id} style={styles.sensor.container}>
                <Text style={styles.sensor.name}>{sensor.name} <Text style={styles.sensor.unitOfMeasure}>({sensor.unitOfMeasure})</Text></Text>
                <Text style={styles.sensor.frequency}>Frequency: {sensor.frequency}</Text>
            </View>
        );
    }
}

SensorsScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    deviceStatus: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceStatus: state.deviceStatus,
    deviceCapabilities: state.deviceCapabilities,
});

export default connect(mapStateToProps, {
    navigateBack
})(SensorsScreen);
