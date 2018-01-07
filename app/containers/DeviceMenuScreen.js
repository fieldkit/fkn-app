'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';

import {
    View,
    Text
} from 'react-native'

import { BackgroundView } from '../components/BackgroundView';
import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import {
    navigateWelcome,
    navigateDataSets,
    navigateSensors,
    navigateConfigure,
    navigateLiveData
} from '../actions/navigation';

import Loading from '../components/Loading';
import DeviceInfo from '../components/DeviceInfo';

import {
    deviceStartConnect,
    deviceStopConnect
} from '../actions/device-status';

import styles from '../styles';

class DeviceMenuScreen extends React.Component {
    static navigationOptions = {
        title: 'Device',
    };

    render() {
        const { deviceInfo, deviceCapabilities: caps } = this.props;

        if (!_.isArray(caps.sensors)) {
            return (<Loading />);
        }

        return  (
            <BackgroundView>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title="Data Sets" onPress={() => this.props.navigateDataSets()} />
                    <MenuButton title="Live Data" onPress={() => this.props.navigateLiveData()} />
                    <MenuButton title="Sensors" onPress={() => this.props.navigateSensors()} />
                    <MenuButton title="Configure" onPress={() => this.props.navigateConfigure()} />
                    <MenuButton title="Home" onPress={() => this.props.navigateWelcome()} />
                </MenuButtonContainer>
            </BackgroundView>
        );
    }
}

DeviceMenuScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    navigateDataSets: PropTypes.func.isRequired,
    navigateSensors: PropTypes.func.isRequired,
    navigateLiveData: PropTypes.func.isRequired,
    navigateConfigure: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceInfo: state.deviceInfo,
    deviceCapabilities: state.deviceCapabilities
});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    navigateDataSets,
    navigateSensors,
    navigateLiveData,
    navigateConfigure,
    navigateWelcome
})(DeviceMenuScreen);
