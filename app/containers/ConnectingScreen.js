'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Text
} from 'react-native'

import { BackgroundView } from '../components/BackgroundView';
import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import { navigateWelcome } from '../actions/navigation';

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
            </BackgroundView>
        );
    }
}

ConnectingScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    deviceStartConnect: PropTypes.func.isRequired,
    deviceStopConnect: PropTypes.func.isRequired,
    deviceStatus: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceStatus: state.deviceStatus
});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    navigateWelcome
})(ConnectingScreen);
