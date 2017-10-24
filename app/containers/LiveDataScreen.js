'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, Text, FlatList, ScrollView } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryLegend, VictoryCursorContainer, VictoryContainer } from "victory-native";

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

    state = {
        scrollEnabled: true
    }

    changeScroll(scrollEnabled) {
        this.setState({ scrollEnabled });
    }

    keyExtractor(sensor, index) {
        return sensor.id;
    }

    render() {
        const { liveData } = this.props;

        if (true) {
            return (
                <View style={styles.liveData.container}>
                    <FlatList
                        scrollEnabled={this.state.scrollEnabled}
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

    renderSensor(sensor) {
        const colors = VictoryTheme.material.legend.colorScale;
        const dotStyle = Object.assign({ backgroundColor: colors[id] }, styles.liveData.legend.dotStyle)
        return (
            <View key={id} style={styles.liveData.legend.container}>
                <View style={dotStyle} />
                <Text style={styles.liveData.legend.sensor.name}>{sensor.name}: </Text>
                <Text style={styles.liveData.legend.sensor.value}>{sensor.value}</Text>
            </View>
        );
    }

    renderSensorChart(item) {
        const sensor = item.item;
        const id = item.index;
        const colors = VictoryTheme.material.legend.colorScale;
        const dotStyle = Object.assign({ backgroundColor: colors[id] }, styles.liveData.legend.dotStyle)

        let chart = (<Loading />);

        if (sensor.data.length > 2) {
            const self = this;
            chart = (
                    <VictoryChart theme={VictoryTheme.material} scale={{x: "time"}}
                        containerComponent={
                            <VictoryCursorContainer
                                onTouchStart={() => { console.log(self); self.changeScroll(false); }}
                                onTouchEnd={() => { console.log(self); self.changeScroll(true); }}
                            />}
                    >
                    <VictoryLine key={id} data={sensor.data} style={{ data: { stroke: colors[id] } }} />
                    </VictoryChart>
            );
        }

        return (
            <View key={id}>
                <View style={styles.liveData.legend.container}>
                    <View style={dotStyle} />
                    <Text style={styles.liveData.legend.sensor.name}>{sensor.name}: </Text>
                    <Text style={styles.liveData.legend.sensor.value}>{sensor.value}</Text>
                </View>
                {chart}
            </View>
        )
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
        const colors = VictoryTheme.material.legend.colorScale;
        return (
            <VictoryLine key={id} data={sensor.data} style={{ data: { stroke: colors[id] } }} />
        )
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
