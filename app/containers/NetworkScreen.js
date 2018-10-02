import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, Button, Text, TextInput } from 'react-native';

import { AppScreen, SmallButton, Loading, DeviceInfo } from '../components';

import { navigateNetwork, navigateBack, queryConfiguration, saveNetworkConfiguration } from '../actions';

import { selectedDevice } from '../reducers/selectors';

import styles, { Colors } from '../styles';

class NetworkInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            ssid: "",
        };
    }

    onEdit() {
        const { network } = this.props;

        this.setState({ editing: true, ssid: network.ssid, password: network.password });
    }

    onCancel() {
        this.setState({ editing: false });
    }

    onSave() {
        const { onSave } = this.props;

        this.setState({ editing: false });

        onSave(this.state);
    }

    render() {
        const { network } = this.props;
        const { editing, ssid, password } = this.state;

        if (editing) {
            return (
                <View style={styles.networks.network.editing.container}>
                    <View>
                        <TextInput style={styles.networks.network.editing.ssid} value={ssid} onChangeText={(text) => this.setState({ ssid: text })} />
                        <TextInput style={styles.networks.network.editing.password} value={password} onChangeText={(text) => this.setState({ password: text })} />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <SmallButton title="Save" onPress={() => this.onSave()} color={Colors.secondaryButton} />
                        <SmallButton title="Cancel" onPress={() => this.onCancel()} color={Colors.secondaryButton} />
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.networks.network.viewing.container}>
                <View style={{flex: 2, flexDirection: 'column'}}>
                    <Text style={styles.networks.network.viewing.ssid}>{network.ssid}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <SmallButton title="Edit" onPress={() => this.onEdit(network)} color={Colors.secondaryButton} />
                </View>
            </View>
        );
    }
};

class NetworkScreen extends React.Component {
    static navigationOptions = {
        title: 'Network',
    };

    componentWillMount() {
        this.props.queryConfiguration();
    }

    onSaveNetwork(index, old, modified) {
        const { saveNetworkConfiguration, deviceConfiguration } = this.props;
        const newNetworkConfiguration = _.cloneDeep(deviceConfiguration.network);
        newNetworkConfiguration.networks[index] = modified;
        saveNetworkConfiguration(newNetworkConfiguration);
    }

    render() {
        const { deviceInfo, deviceConfiguration } = this.props;

        return (
            <AppScreen>
                <DeviceInfo info={deviceInfo} />
                <View style={styles.networks.container}>
                    <Text style={styles.networks.heading}>Saved Networks:</Text>

                    {deviceConfiguration.network.networks.map((network, i) => <NetworkInfo key={i} network={network} onSave={modified => this.onSaveNetwork(i, network, modified)} />)}
                </View>
            </AppScreen>
        );
    }
}

NetworkScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    queryConfiguration: PropTypes.func.isRequired,
    saveNetworkConfiguration: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    deviceConfiguration: PropTypes.object.isRequired,
};

const mapStateToProps = state => selectedDevice(state);

export default connect(mapStateToProps, {
    navigateBack,
    queryConfiguration,
    saveNetworkConfiguration,
})(NetworkScreen);
