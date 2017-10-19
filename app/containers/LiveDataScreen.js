'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Text
} from 'react-native'

import { BackgroundView } from '../components/BackgroundView';

import { navigateBack } from '../actions/navigation';
import { startLiveDataPoll, stopLiveDataPoll } from '../actions/device-data';

class LiveDataScreen extends React.Component {
    static navigationOptions = {
        title: 'Live Data',
    };

    componentDidMount() {
        this.props.startLiveDataPoll();
    }

    componentWillUnmount() {
        this.props.stopLiveDataPoll();
    }

    render() {
        return (
            <BackgroundView>
            </BackgroundView>
        );
    }
}

LiveDataScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    startLiveDataPoll: PropTypes.func.isRequired,
    stopLiveDataPoll: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
    navigateBack,
    startLiveDataPoll,
    stopLiveDataPoll
})(LiveDataScreen);
