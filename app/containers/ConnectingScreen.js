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
import { SmallButton } from '../components/Buttons';

import { navigateWelcome } from '../actions/navigation';
import { deviceStartConnect, deviceSelect, deviceStopConnect } from '../actions/device-status';

import { unixNow } from '../lib/helpers';

import styles from '../styles';

class ConnectingScreen extends React.Component {
    static navigationOptions = {
        title: 'Connecting...',
    };

    componentWillUpdate(nextProps, nextState) {
        const { device } = nextProps;
    }

    componentDidMount() {
        this.props.deviceStartConnect()
    }

    render() {
        const { deviceStatus } = this.props;

        let status = "Searching...";
        if (deviceStatus.address.valid) {
            status = "Connecting...";
        }
        if (deviceStatus.ping.success) {
            status = "Connected";
        }

        return (
            <BackgroundView>
                <MenuButtonContainer>
                    <MenuButton title="Cancel" onPress={() => this.props.navigateWelcome()} />
                </MenuButtonContainer>
                <Text style={styles.connecting.status}>{status}</Text>
                <View style={{flexDirection: 'column'}}>
                    {_.map(deviceStatus.addresses, (device, _) => this.renderDevice(device))}
                </View>
            </BackgroundView>
        );
    }

    renderDevice(device) {
        return (
            <View key={device.host} style={styles.device.container}>
                <View style={{flex: 2, flexDirection: 'column'}}>
                    <Text style={styles.device.name}>{device.host}</Text>
                    <Text style={styles.device.details}>FieldKit Device</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <SmallButton title="Connect" onPress={() => this.props.deviceSelect(device)} color={'#ADD8E6'} />
                </View>
            </View>
        );
    }
}

ConnectingScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    deviceStartConnect: PropTypes.func.isRequired,
    deviceStopConnect: PropTypes.func.isRequired,
    deviceSelect: PropTypes.func.isRequired,
    deviceStatus: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceStatus: state.deviceStatus
});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    deviceSelect,
    navigateWelcome
})(ConnectingScreen);
