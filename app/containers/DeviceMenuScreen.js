'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';

import {
    View,
    Text
} from 'react-native'

import { BackgroundView } from '../components/BackgroundView';
import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import {
    navigateWelcome,
    navigateDataSets,
    navigateLiveData
} from '../actions/navigation';

import Loading from '../components/Loading';

import {
    deviceStartConnect,
    deviceStopConnect
} from '../actions/device-status';

import styles from '../styles';

class DeviceMenuScreen extends React.Component {
    static navigationOptions = {
        title: 'Device',
    };

    render() {
        const { deviceCapabilities: caps } = this.props;

        if (!_.isArray(caps.sensors)) {
            return (<Loading />);
        }

        return  (
            <BackgroundView>
                <View>
                    <Text style={styles.deviceName}>{caps.name}</Text>
                    {caps.sensors.map((s, i) => this.renderSensor(s, i))}
                </View>
                <MenuButtonContainer>
                    <MenuButton title="Data Sets" onPress={() => this.props.navigateDataSets()} />
                    <MenuButton title="Live Data" onPress={() => this.props.navigateLiveData()} />
                    <MenuButton title="Home" onPress={() => this.props.navigateWelcome()} />
                </MenuButtonContainer>
            </BackgroundView>
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

DeviceMenuScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    navigateDataSets: PropTypes.func.isRequired,
    navigateLiveData: PropTypes.func.isRequired,
    deviceStatus: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceStatus: state.deviceStatus,
    deviceCapabilities: state.deviceCapabilities
});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    navigateDataSets,
    navigateLiveData,
    navigateWelcome
})(DeviceMenuScreen);
