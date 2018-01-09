'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';

import { View, Text, Button } from 'react-native';

import { AppScreen, SmallButton } from '../components';

import { navigateWelcome, deviceStartConnect, deviceSelect, deviceStopConnect } from '../actions';

import { unixNow } from '../lib/helpers';

import styles, { Colors } from '../styles';

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

        let status = null;

        if (_.size(deviceStatus.addresses) == 0) {
            status = "Searching...";
        }

        return (
            <AppScreen>
                <Button style={styles.connecting.cancel} title="Cancel" onPress={() => this.props.navigateWelcome()} />
                { status != null ? <Text style={styles.connecting.status}>{status}</Text> : <View/> }
                <View style={{marginTop: 10, flexDirection: 'column'}}>
                    {_.map(deviceStatus.addresses, (device, _) => this.renderDevice(device))}
                </View>
            </AppScreen>
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
                    <SmallButton title="Connect" onPress={() => this.props.deviceSelect(device)} color={Colors.secondaryButton} />
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
