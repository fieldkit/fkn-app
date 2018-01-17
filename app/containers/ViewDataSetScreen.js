'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import { View, Text, Button } from 'react-native';

import { AppScreen, SmallButton, ProgressModal, Loading } from '../components';

import { navigateBack, queryDataSet, eraseDataSet, startDownloadDataSet, emailDataSet } from '../actions';

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
        const { progress, dataSet, download } = this.props;

        if (!dataSet) {
            return (<Loading />);
        }

        const time = moment(dataSet.time).format("MMM Do hA");

        return (
            <AppScreen progress={progress}>
                <View style={styles.dataSet.container}>
                    <Text style={styles.dataSet.name}>{dataSet.name}</Text>
                    <Text style={styles.dataSet.details}>{time} Size: {dataSet.size}</Text>
                    <View style={{
                            flexDirection: 'row'
                        }}>
                        <SmallButton title="Erase" onPress={() => this.props.eraseDataSet(dataSet.id)} />
                        <SmallButton title="Download" onPress={() => this.props.startDownloadDataSet(dataSet.id)} />
                        <SmallButton title="E-Mail" onPress={() => this.props.emailDataSet(dataSet.id)} />
                    </View>
                    <ProgressModal visible={download.active} progress={download.progress} />
                </View>
            </AppScreen>
        );
    }
}

ViewDataSetScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    queryDataSet: PropTypes.func.isRequired,
    eraseDataSet: PropTypes.func.isRequired,
    startDownloadDataSet: PropTypes.func.isRequired,
    emailDataSet: PropTypes.func.isRequired,
    dataSetId: PropTypes.number,
    dataSet: PropTypes.object,
    download: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    const route = state.nav.routes[state.nav.index];
    return {
        progress: state.progress,
        deviceCapabilities: state.deviceCapabilities,
        dataSetId: route.params ? route.params.id : null,
        dataSet: state.dataSet,
        download: state.download,
    };
};

export default connect(mapStateToProps, {
    navigateBack,
    queryDataSet,
    eraseDataSet,
    startDownloadDataSet,
    emailDataSet
})(ViewDataSetScreen);
