'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import {
    View,
    Text,
    Button
} from 'react-native'

import { SmallButton } from '../components/MenuButtons';

import { navigateBack } from '../actions/nav';
import { queryDataSet, eraseDataSet } from '../actions/device-status';

import Loading from '../components/Loading';

import styles from '../styles';

class ViewDataSetScreen extends React.Component {
    static navigationOptions = {
        title: 'Data Set',
    };

    componentWillMount() {
        const { dataSetId, navigation } = this.props;

        this.props.queryDataSet(dataSetId);
    }

    componentWillReceiveProps(nextProps) {
        const { dataSet: oldDataSet } = this.props;
        const { dataSet: newDataSet } = nextProps;

        if (oldDataSet && newDataSet && oldDataSet.erased != newDataSet.erased && newDataSet.erased) {
            this.props.navigateBack();
        }
    }

    render() {
        const { dataSet } = this.props;

        if (!dataSet) {
            return (<Loading />);
        }

        const time = moment(dataSet.time).format("MMM Do hA");

        return (
            <View style={styles.dataSet.container}>
                <Text style={styles.dataSet.name}>{dataSet.name}</Text>
                <Text style={styles.dataSet.details}>{time} Size: {dataSet.size}</Text>

                <SmallButton title="Erase" onPress={() => this.props.eraseDataSet(dataSet.id)} />
            </View>
        );
    }
}

ViewDataSetScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    queryDataSet: PropTypes.func.isRequired,
    eraseDataSet: PropTypes.func.isRequired,
    dataSetId: PropTypes.number,
    dataSet: PropTypes.object,
};

const mapStateToProps = (state) => {
    const route = state.nav.routes[state.nav.index];
    return {
        deviceCapabilities: state.deviceCapabilities,
        dataSetId: route.params ? route.params.id : null,
        dataSet: state.dataSet,
    };
};

export default connect(mapStateToProps, {
    navigateBack,
    queryDataSet,
    eraseDataSet
})(ViewDataSetScreen);
