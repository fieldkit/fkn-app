import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RNLanguages from 'react-native-languages';
import i18n from '../internationalization/i18n';

import { View, ScrollView, Text } from 'react-native';

import { AppScreen, DeviceInfo } from '../components';

import { navigateBack } from '../actions';

import { selectedDevice } from '../reducers/selectors';

import styles from '../styles';

class SensorInfo extends React.Component {
    getUnitOfMeasure(sensor) {
        if (sensor.unitOfMeasure == "") {
            return "";
        }
        return "(" + sensor.unitOfMeasure + ")";
    }
    render() {
        const { sensor } = this.props;

        return (
            <View style={styles.sensor.container}>
                <Text style={styles.sensor.name}>{sensor.name} <Text style={styles.sensor.unitOfMeasure}>{this.getUnitOfMeasure(sensor)}</Text></Text>
            </View>
        );
    }
}

class SensorsScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return { title: i18n.t('sensors.title') };
    };
    // static navigationOptions = {
    //     title: 'Sensors',
    // };

    render() {
        const { deviceInfo, deviceCapabilities } = this.props;

        return (
            <AppScreen background={false}>
                <ScrollView>
                    <DeviceInfo info={deviceInfo} />
                    {deviceCapabilities.sensors.map((s, i) => <SensorInfo key={i} sensor={s} />)}
                </ScrollView>
            </AppScreen>
        );
    }
}

SensorsScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
};

const mapStateToProps = state => selectedDevice(state);

export default connect(mapStateToProps, {
    navigateBack
})(SensorsScreen);
