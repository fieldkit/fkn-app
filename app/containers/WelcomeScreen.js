'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Button
} from 'react-native'

import {
    navigateConnecting,
    navigateAbout
} from '../actions';

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    render() {
        const { navigateConnecting, navigateAbout } = this.props;
        return (
            <View>
                <Button title="Connect" onPress={() => navigateConnecting()} />
                <Button title="About" onPress={() => navigateAbout()} />
            </View>
        );
    }
}

WelcomeScreen.propTypes = {
    navigateConnecting: PropTypes.func.isRequired,
    navigateAbout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
    navigateConnecting,
    navigateAbout
})(WelcomeScreen);
