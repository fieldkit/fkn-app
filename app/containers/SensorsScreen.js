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
import DeviceInfo from '../components/DeviceInfo';

import styles from '../styles';

class SensorInfo extends React.Component {
    render() {
        const { sensor } = this.props;

        return (
            <View style={styles.sensor.container}>
                <Text style={styles.sensor.name}>{sensor.name} <Text style={styles.sensor.unitOfMeasure}>({sensor.unitOfMeasure})</Text></Text>
            </View>
        );
    }
}

class SensorsScreen extends React.Component {
    static navigationOptions = {
        title: 'Sensors',
    };

    componentWillMount() {
    }

    render() {
        const { deviceInfo, deviceCapabilities } = this.props;

        return (
            <ScrollView>
                <DeviceInfo info={deviceInfo} />
                {deviceCapabilities.sensors.map((s, i) => <SensorInfo key={i} sensor={s} />)}
            </ScrollView>
        );
    }
}

SensorsScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceInfo: state.deviceInfo,
    deviceCapabilities: state.deviceCapabilities,
});

export default connect(mapStateToProps, {
    navigateBack
})(SensorsScreen);
