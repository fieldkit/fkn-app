'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';

import {
    View,
    Text
} from 'react-native'

import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import { navigateWelcome } from '../actions/nav';

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

        let info = (
            <View>
            </View>
        );
        if (_.isArray(caps.sensors)) {
            info = (
                <View>
                    <Text style={styles.deviceName}>{caps.name}</Text>
                    {caps.sensors.map((s, i) => <Text key={i} style={styles.sensorName}>{s.name}</Text>)}
                </View>
            );
        }

        return  (
            <View>
                {info}
                <MenuButtonContainer>
                <MenuButton title="Home" onPress={() => this.props.navigateWelcome()} />
                </MenuButtonContainer>
            </View>
        );
    }
}

DeviceMenuScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
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
    navigateWelcome
})(DeviceMenuScreen);
