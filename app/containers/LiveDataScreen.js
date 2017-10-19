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

import styles from '../styles';

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
        const { liveData } = this.props;

        return (
            <BackgroundView>
                {liveData.sensors.map((s, i) => this.renderSensor(s, s.id))}
            </BackgroundView>
        );
    }

    renderSensor(sensor, id) {
        return (
            <View key={id} style={styles.liveData.container}>
                <Text style={styles.liveData.sensor.name}>{sensor.name}</Text>
                <Text style={styles.liveData.sensor.value}>{sensor.value}</Text>
            </View>
        );
    }
}

LiveDataScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    startLiveDataPoll: PropTypes.func.isRequired,
    stopLiveDataPoll: PropTypes.func.isRequired,
    liveData: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    liveData: state.liveData
});

export default connect(mapStateToProps, {
    navigateBack,
    startLiveDataPoll,
    stopLiveDataPoll
})(LiveDataScreen);
