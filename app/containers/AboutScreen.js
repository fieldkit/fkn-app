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
    navigateWelcome
} from '../actions/nav';

class AboutScreen extends React.Component {
    static navigationOptions = {
        title: 'About',
    };

    render() {
        const { navigateWelcome } = this.props;
        return (
            <View>
                <Button title="Welcome" onPress={() => navigateWelcome()} />
            </View>
        );
    }
}

AboutScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
    navigateWelcome
})(AboutScreen);
