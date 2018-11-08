import _ from 'lodash';
import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, Text, ScrollView } from 'react-native';

import { SmallButton, AppScreen, Loading } from '../components';

import { navigateBack, queryFiles, deleteFile } from '../actions';

import styles from '../styles';

class DataTableScreen extends React.Component {
    static navigationOptions = {
        title: 'Data Table',
    };

    render() {
        const { deviceInfo, deviceCapabilities: caps } = this.props;

        return (
            <AppScreen background={false}>
                <ScrollView>
                </ScrollView>
            </AppScreen>
        );
    }
}

DataTableScreen.propTypes = {
    path: PropTypes.string.isRequired,
    localFiles: PropTypes.object.isRequired,
    navigateBack: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    queryFiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const route = state.nav.routes[state.nav.index];
    return {
        path: route.params ? route.params.path : "/",
        localFiles: state.localFiles,
    };
};

export default connect(mapStateToProps, {
    navigateBack,
    queryFiles,
    deleteFile
})(DataTableScreen);
