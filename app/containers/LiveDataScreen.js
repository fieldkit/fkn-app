'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, Text, FlatList, ScrollView, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryLegend, VictoryCursorContainer, VictoryContainer } from "victory-native";
import Svg from 'react-native-svg';

import { BackgroundView } from '../components/BackgroundView';
import Loading from '../components/Loading';

import { navigateBack } from '../actions/navigation';
import { startLiveDataPoll, stopLiveDataPoll } from '../actions/device-data';

import styles from '../styles';

class LiveDataScreen extends React.Component {
    static navigationOptions = {
        title: 'Live Data',
    };

    state = {
        chartPerSensor: true
    }

    componentDidMount() {
        this.props.startLiveDataPoll();
    }

    componentWillUnmount() {
        this.props.stopLiveDataPoll();
    }

    keyExtractor(sensor, index) {
        return sensor.id;
    }

    render() {
        const { liveData } = this.props;

        // This can't be changed, for now. Just trying out different approaches.
        if (this.state.chartPerSensor) {
            return (
                <View style={styles.liveData.container}>
                    <FlatList
                        data={liveData.sensors}
                        renderItem={(item) => this.renderSensorChart(item)}
                        keyExtractor={this.keyExtractor} />
                </View>
            );
        }

        return (
            <View style={styles.liveData.container}>
                <View style={{ flex: 1 }}>
                    {liveData.sensors.map((s, i) => this.renderSensor(s, s.id))}
                </View>
                <View style={styles.liveData.chart.container}>
                    {this.renderChart()}
                </View>
            </View>
        );
    }

    renderSensorHeader(sensor, id) {
        const colors = VictoryTheme.material.legend.colorScale;
        const dotStyle = Object.assign({ backgroundColor: colors[id] }, styles.liveData.legend.dotStyle)
        return (
            <View key={id} style={styles.liveData.legend.container}>
                <View style={dotStyle} />
                <Text style={styles.liveData.legend.sensor.name}>{sensor.name}: </Text>
                <Text style={styles.liveData.legend.sensor.value}>{ sensor.value ? (sensor.value + sensor.unitOfMeasure) : "Collecting..."}</Text>
            </View>
        );
    }

    renderSensorChart(item) {
        const sensor = item.item;
        const id = item.index;
        const colors = VictoryTheme.material.legend.colorScale;
        const dotStyle = Object.assign({ backgroundColor: colors[id] }, styles.liveData.legend.dotStyle)

        let chart = (<Loading />);
        if (sensor.data.length > 1) {
            const { width: windowWidth } = Dimensions.get('window');
            const chartWidth = windowWidth;
            const chartHeight = 250;
            const viewBox = "0 0 " + chartWidth + " " + chartHeight;
            chart = (
                // This Svg wrapper is a workaround for this bug:
                // https://github.com/FormidableLabs/victory-native/issues/96
                // Basically, scrolling on Android is broken due to a bug in either
                // react native or react-native-svg and nobody knows what's going on.
                // There were some other workarounds, although none of them worked for
                // me. This seems to work best.
                <Svg width={chartWidth} height={chartHeight} viewBox={viewBox} style={{ width: "100%", height: "auto" }}>
                    <VictoryChart theme={VictoryTheme.material} scale={{x: "time"}} standalone={false} width={chartWidth} height={chartHeight}>
                        <VictoryLine key={id} data={sensor.data} style={{ data: { stroke: colors[id] } }} />
                    </VictoryChart>
                </Svg>
            );
        }

        return (
            <View key={id}>
                {this.renderSensorHeader(sensor, id)}
                {chart}
            </View>
        )
    }

    renderChartWithAllSensors() {
        const { liveData } = this.props;
        const colors = VictoryTheme.material.legend.colorScale;

        return (
            <VictoryChart theme={VictoryTheme.material} scale={{x: "time"}}>
                {liveData.sensors.filter(s => s.data.length > 1).map((sensor, id) => {
                    return (
                        <VictoryLine key={id} data={sensor.data} style={{ data: { stroke: colors[id] } }} />
                    )
                })}
            </VictoryChart>
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
