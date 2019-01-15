import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RNLanguages from 'react-native-languages';

import i18n from '../internationalization/i18n';

import { View, Text, Button } from 'react-native';

import { AppScreen, SmallButton } from '../components';

import { navigateWelcome, deviceStartConnect, deviceSelect, deviceStopConnect } from '../actions';

import { unixNow } from '../lib/helpers';

import styles, { Colors } from '../styles';

class ConnectingScreen extends React.Component {
    static navigationOptions = {
        title: 'Connecting...',
    };

    componentDidMount() {
        this.props.deviceStartConnect();
    }

    render() {
        const { devices } = this.props;

        let status = null;

        if (_.size(devices) == 0) {
            status = "Searching...";
        }

        return (
            <AppScreen>
                <Button style={styles.connecting.cancel} title={i18n.t('connecting.cancel')} onPress={() => this.props.navigateWelcome()} />
                { status != null ? <Text style={styles.connecting.status}>{status}</Text> : <View/> }
                <View style={{marginTop: 10, flexDirection: 'column'}}>
                    {_.map(devices, (device, _) => this.renderDevice(device))}
                </View>
            </AppScreen>
        );
    }

    renderDevice(device) {
        return (
            <View key={device.address.key} style={styles.device.container}>
                <View style={{flex: 2, flexDirection: 'column'}}>
                    <Text style={styles.device.name}>{device.address.host}</Text>
                    <Text style={styles.device.details}>{device.capabilities.name}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <SmallButton title="Connect" onPress={() => this.props.deviceSelect(device.address)} color={Colors.secondaryButton} />
                </View>
            </View>
        );
    }
}

ConnectingScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    deviceStartConnect: PropTypes.func.isRequired,
    deviceStopConnect: PropTypes.func.isRequired,
    deviceSelect: PropTypes.func.isRequired,
    devices: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    devices: state.devices
});

export default connect(mapStateToProps, {
    deviceStartConnect,
    deviceStopConnect,
    deviceSelect,
    navigateWelcome
})(ConnectingScreen);
