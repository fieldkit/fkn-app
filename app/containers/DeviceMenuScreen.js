import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';

import { View, Text } from 'react-native';

import { AppScreen, Loading, DeviceInfo, MenuButtonContainer, MenuButton } from '../components';

import {
    navigateWelcome,
    navigateDataSets,
    navigateFiles,
    navigateSensors,
    navigateConfigure,
    navigateLiveData,
    navigateName,
    queryInfo,
    deviceStartConnect,
    deviceStopConnect
} from '../actions';

import styles from '../styles';

class DeviceMenuScreen extends React.Component {
    static navigationOptions = {
        title: 'Device Menu',
    };

    componentDidMount() {
        this.props.queryInfo();
    }

    renderDeviceSpecific() {
        const { deviceSpecificRoutes } = this.props;

        return (
            <View>
                {deviceSpecificRoutes.home.routes.map((r, i) => {
                    return <MenuButton key={i} title={r.title} onPress={() => this.props.navigateName(r.name)} />
                })}
            </View>
        );
    }

    render() {
        const { progress, deviceInfo, deviceCapabilities: caps } = this.props;

        return (
            <AppScreen progress={progress}>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title="Files" onPress={() => this.props.navigateFiles()} />
                    {false && <MenuButton title="Data Sets" onPress={() => this.props.navigateDataSets()} />}
                    <MenuButton title="Live Data" onPress={() => this.props.navigateLiveData()} />
                    <MenuButton title="Sensors" onPress={() => this.props.navigateSensors()} />
                    <MenuButton title="Configure" onPress={() => this.props.navigateConfigure()} />
                    {this.renderDeviceSpecific()}
                    <MenuButton title="Home" onPress={() => this.props.navigateWelcome()} />
                </MenuButtonContainer>
            </AppScreen>
        );
    }
}

DeviceMenuScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    navigateDataSets: PropTypes.func.isRequired,
    navigateFiles: PropTypes.func.isRequired,
    navigateSensors: PropTypes.func.isRequired,
    navigateLiveData: PropTypes.func.isRequired,
    navigateConfigure: PropTypes.func.isRequired,
    navigateName: PropTypes.func.isRequired,
    queryInfo: PropTypes.func.isRequired,
    progress: PropTypes.object.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
    deviceSpecificRoutes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    progress: state.progress,
    deviceInfo: state.deviceInfo,
    deviceCapabilities: state.deviceCapabilities,
    deviceSpecificRoutes: state.deviceSpecificRoutes,
});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    queryInfo,
    navigateDataSets,
    navigateFiles,
    navigateSensors,
    navigateLiveData,
    navigateConfigure,
    navigateName,
    navigateWelcome
})(DeviceMenuScreen);
