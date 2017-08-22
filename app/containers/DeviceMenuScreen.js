'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Text,
    Button
} from 'react-native'

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

    componentDidMount() {
        this.props.deviceStartConnect()
    }

    componentWillUnmount() {
        this.props.deviceStopConnect();
    }

    render() {
        return (
            <View>
                <Button title="Home" onPress={() => this.props.navigateWelcome()} />
            </View>
        );
    }
}

DeviceMenuScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    device: state.device
});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    navigateWelcome
})(DeviceMenuScreen);
