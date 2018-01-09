'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import { View, Text } from 'react-native';

import { SmallButton, AppScreen, Loading } from '../components';

import { navigateBack, navigateViewDataSet, queryDataSets } from '../actions';

import styles from '../styles';

class DataSetsScreen extends React.Component {
    static navigationOptions = {
        title: 'Data Sets',
    };

    componentWillMount() {
        this.props.queryDataSets();
    }

    render() {
        const { deviceCapabilities: caps, dataSets } = this.props;

        if (!_.isArray(dataSets.dataSets)) {
            return (<Loading />);
        }

        return (
            <AppScreen>
                {dataSets.dataSets.map((ds, i) => this.renderDataSet(ds, i))}
            </AppScreen>
        );
    }

    renderDataSet(dataSet, id) {
        const time = moment(dataSet.time).format("MMM Do hA");

        return (
            <View key={id} style={styles.dataSet.container}>
                <Text style={styles.dataSet.name}>{dataSet.name}</Text>
                <Text style={styles.dataSet.details}>{time} Size: {dataSet.size}</Text>
                <SmallButton title="View" onPress={() => this.props.navigateViewDataSet(dataSet.id)} />
            </View>
        );
    }
}

DataSetsScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    navigateViewDataSet: PropTypes.func.isRequired,
    queryDataSets: PropTypes.func.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceCapabilities: state.deviceCapabilities,
    dataSets: state.dataSets
});

export default connect(mapStateToProps, {
    navigateBack,
    navigateViewDataSet,
    queryDataSets
})(DataSetsScreen);
