'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Button
} from 'react-native'

import {
    deviceHello,
    navigateAbout
} from '../actions';

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    componentDidMount() {
        this.props.deviceHello();
    }

    render() {
        const { navigateAbout } = this.props;
        return (
            <View>
                <Button title="About" onPress={() => navigateAbout()} />
            </View>
        );
    }
}

WelcomeScreen.propTypes = {
    deviceHello: PropTypes.func.isRequired,
    navigateAbout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
    deviceHello,
    navigateAbout
})(WelcomeScreen);
