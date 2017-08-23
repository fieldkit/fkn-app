'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
        const { device } = this.props;
        let status = "Searching...";
        if (device.address.valid) {
            status = "Connecting...";
        }
        if (device.ping.success) {
            status = "Connected";
        }

        return (
            <View>
                <MenuButtonContainer>
                    <MenuButton title="Cancel" onPress={() => this.props.navigateWelcome()} />
                </MenuButtonContainer>
                <Text style={styles.connecting.status}>{status}</Text>
            </View>
        );
    }
}

ConnectingScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    deviceStartConnect: PropTypes.func.isRequired,
    deviceStopConnect: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    device: state.device
});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    navigateWelcome
})(ConnectingScreen);
