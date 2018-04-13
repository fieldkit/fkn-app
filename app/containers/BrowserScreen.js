import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import { View, Text } from 'react-native';

import { SmallButton, AppScreen, Loading, DeviceInfo } from '../components';

import { navigateBack } from '../actions';

import styles from '../styles';

class BrowserScreen extends React.Component {
    static navigationOptions = {
        title: 'Browser',
    };

    componentWillMount() {
    }

    render() {
        const { progress } = this.props;

        return (
            <AppScreen progress={progress}>
            </AppScreen>
        );
    }
}

BrowserScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    progress: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    progress: state.progress,
});

export default connect(mapStateToProps, {
    navigateBack
})(BrowserScreen);
