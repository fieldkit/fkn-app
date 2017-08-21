import React, { Component } from 'react'
import PropTypes from 'prop-types';

import {
    Button
} from 'react-native'

import * as Actions from '../actions';

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    render() {
        const navigation = this.props.navigation;
        return (
                <Button title="About" onPress={() => navigation.dispatch(Actions.navigateAbout())} />
        );
    }
}

WelcomeScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default WelcomeScreen
