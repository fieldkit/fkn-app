import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, Button } from 'react-native';

import { AppScreen } from '../components';

import { deviceStartConnect, findAllFiles, copyFromDevices } from '../actions';

import styles from '../styles';

class DeviceOptions extends React.Component {
    onSync() {
        const { easyMode, copyFromDevices } = this.props;

        copyFromDevices(easyMode.devices);
    }

    render() {
        const { easyMode } = this.props;

        const numberOfDevices = _.size(easyMode.devices);
        if (numberOfDevices == 0) {
            if (!easyMode.networkConfiguration.deviceAp) {
                return (
                    <View style={{ padding: 10 }}><Text style={{ textAlign: 'center' }}>No devices found. Try connecting to a FieldKit device's AP.</Text></View>
                );
            }
            else {
                return (
                    <View style={{ padding: 10 }}><Text style={{ textAlign: 'center' }}>No devices found.</Text></View>
                );
            }
        }

        return (
            <View style={{ padding: 10 }}>
              <View><Text style={{ textAlign: 'center' }}>Success, {numberOfDevices} device(s) found</Text></View>
              <View><Button title="Device -> Phone" onPress={() => this.onSync()} /></View>
            </View>
        );
    }
}

class EasyModeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    componentDidMount() {
        this.props.findAllFiles();
        this.props.deviceStartConnect();
    }

    render() {
        const { easyMode, copyFromDevices } = this.props;

        return (
            <AppScreen>
              <Image source={require('../../assets/fk-header.png')}
                     style={{
                         resizeMode: 'contain',
                         width: '100%',
                         height: 200,
                     }} />

              <DeviceOptions easyMode={easyMode} copyFromDevices={copyFromDevices} />
            </AppScreen>
        );
    }

}

EasyModeScreen.propTypes = {
    deviceStartConnect: PropTypes.func.isRequired,
    copyFromDevices: PropTypes.func.isRequired,
    findAllFiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    easyMode: {
        networkConfiguration: state.networkConfiguration,
        devices: state.devices,
    }
});

export default connect(mapStateToProps, {
    findAllFiles,
    copyFromDevices,
    deviceStartConnect
})(EasyModeScreen);
