import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, Text } from 'react-native';

import { AppScreen, Loading, DeviceInfo, MenuButtonContainer, MenuButton } from '../components';

import {
    navigateWelcome,
    navigateFiles,
    navigateSensors,
    navigateConfigure,
    navigateLiveData,
    navigateName,
    queryInfo,
    deviceStartConnect,
    deviceStopConnect
} from '../actions';

import { selectedDevice } from '../reducers/selectors';

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
        const { deviceInfo, deviceCapabilities: caps } = this.props;

        return (
            <AppScreen>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title="Files" onPress={() => this.props.navigateFiles()} />
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
    navigateFiles: PropTypes.func.isRequired,
    navigateSensors: PropTypes.func.isRequired,
    navigateLiveData: PropTypes.func.isRequired,
    navigateConfigure: PropTypes.func.isRequired,
    navigateName: PropTypes.func.isRequired,
    queryInfo: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
    deviceSpecificRoutes: PropTypes.object.isRequired,
};

const mapStateToProps = state => selectedDevice(state);

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    queryInfo,
    navigateFiles,
    navigateSensors,
    navigateLiveData,
    navigateConfigure,
    navigateName,
    navigateWelcome
})(DeviceMenuScreen);
