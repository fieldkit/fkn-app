'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, Text } from 'react-native'
import { VictoryLine, VictoryChart, VictoryTheme } from "victory-native";

import { BackgroundView } from '../components/BackgroundView';
import Loading from '../components/Loading';

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

    renderChart() {
        const { liveData } = this.props;

        return (
            <VictoryChart theme={VictoryTheme.material} scale={{x: "time"}}>
                {liveData.sensors.filter(s => s.data.length > 1).map((s, i) => this.renderSensorLine(s, s.id))}
            </VictoryChart>
        );
    }

    renderSensorLine(sensor, id) {
        return (
            <VictoryLine key={id} style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc"}
                }}
                data={sensor.data}
            />
        )
    }

    render() {
        const { liveData } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <BackgroundView>
                    {liveData.sensors.map((s, i) => this.renderSensor(s, s.id))}
                </BackgroundView>
                <View style={{ width: '100%', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#000', position: 'absolute', bottom: 0 }}>
                    {this.renderChart()}
                </View>
            </View>
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
