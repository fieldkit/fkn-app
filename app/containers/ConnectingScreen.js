'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Text,
    Button
} from 'react-native'

import {
    deviceStartConnect,
    deviceStopConnect,
    navigateWelcome
} from '../actions';

class ConnectingScreen extends React.Component {
    static navigationOptions = {
        title: 'Connecting',
    };

    componentDidMount() {
        this.props.deviceStartConnect()
    }

    render() {
        return (
            <View>
                <Text>Connecting...</Text>
                <Button title="Cancel" onPress={() => {
                    this.props.deviceStopConnect();
                    this.props.navigateWelcome();
                }} />
            </View>
        );
    }
}

ConnectingScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    navigateWelcome
})(ConnectingScreen);
