import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Button, ScrollView } from 'react-native';

import { AppScreen, DeviceInfo, MenuButtonContainer, MenuButton } from '../../components';

import { navigateBack, timerStart, timerCancel } from '../../actions';

import { atlasCalibrationBegin, atlasCalibrationEnd, atlasCalibrationTemperatureSet, atlasReadSensor, atlasSensorCommand, atlasSetProbeType, atlasCalibrate } from './actions';

import { SensorType } from './protocol';

import { AtlasPhOnePointScript, AtlasPhTwoPointScript, AtlasPhThreePointScript } from './PhSensor';
import { AtlasEcScript } from './EcSensor';
import { AtlasOrpScript } from './OrpSensor';
import { AtlasDoOnePointScript, AtlasDoTwoPointScript } from './DoSensor';
import { AtlasTemperatureScript } from './TempSensor';

class AtlasCalibrationScreen extends React.Component {
    static navigationOptions = {
        title: 'Calibrate',
    };

    state = {
        script: null
    }

    componentDidMount() {
        this.onCancel();
    }

    startCalibration(sensor, script) {
        this.props.atlasCalibrationBegin(sensor);

        this.setState({
            script: script
        });
    }

    onCancel() {
        this.props.atlasCalibrationEnd();

        this.setState({
            script: null
        });
    }

    phOnePointScript() {
        const { timerStart, timerCancel, atlasCalibrate, timer, atlasState } = this.props;

        return <AtlasPhOnePointScript timerStart={timerStart} timerCancel={timerCancel} atlasCalibrate={atlasCalibrate} timer={timer} atlasState={atlasState} onCancel={() => this.onCancel()} />;
    }

    phTwoPointScript() {
        const { timerStart, timerCancel, atlasCalibrate, timer, atlasState } = this.props;

        return <AtlasPhTwoPointScript timerStart={timerStart} timerCancel={timerCancel} atlasCalibrate={atlasCalibrate} timer={timer} atlasState={atlasState} onCancel={() => this.onCancel()} />;
    }

    phThreePointScript() {
        const { timerStart, timerCancel, atlasCalibrate, timer, atlasState } = this.props;

        return <AtlasPhThreePointScript timerStart={timerStart} timerCancel={timerCancel} atlasCalibrate={atlasCalibrate} timer={timer} atlasState={atlasState} onCancel={() => this.onCancel()} />;
    }

    ecScript() {
        const { timerStart, timerCancel, atlasCalibrate, timer, atlasState, atlasReadSensor, atlasSetProbeType, atlasCalibrationTemperatureSet } = this.props;

        return <AtlasEcScript timerStart={timerStart} timerCancel={timerCancel} atlasCalibrate={atlasCalibrate} timer={timer} atlasState={atlasState} onCancel={() => this.onCancel()}
                atlasReadSensor={atlasReadSensor} atlasSetProbeType={atlasSetProbeType} atlasCalibrationTemperatureSet={atlasCalibrationTemperatureSet} />;
    }

    orpScript() {
        const { timerStart, timerCancel, atlasCalibrate, timer, atlasState } = this.props;

        return <AtlasOrpScript timerStart={timerStart} timerCancel={timerCancel} atlasCalibrate={atlasCalibrate} timer={timer} atlasState={atlasState} onCancel={() => this.onCancel()}
                atlasReadSensor={atlasReadSensor} atlasSetProbeType={atlasSetProbeType} />;
    }

    doOnePointScript() {
        const { timerStart, timerCancel, atlasCalibrate, timer, atlasState } = this.props;

        return <AtlasDoOnePointScript timerStart={timerStart} timerCancel={timerCancel} atlasCalibrate={atlasCalibrate} timer={timer} atlasState={atlasState} onCancel={() => this.onCancel()} />;
    }

    doTwoPointScript() {
        const { timerStart, timerCancel, atlasCalibrate, timer, atlasState } = this.props;

        return <AtlasDoTwoPointScript timerStart={timerStart} timerCancel={timerCancel} atlasCalibrate={atlasCalibrate} timer={timer} atlasState={atlasState} onCancel={() => this.onCancel()} />;
    }

    temperatureScript() {
        const { timerStart, timerCancel, atlasCalibrate, timer, atlasState } = this.props;

        return <AtlasTemperatureScript timerStart={timerStart} timerCancel={timerCancel} atlasCalibrate={atlasCalibrate} timer={timer} atlasState={atlasState} onCancel={() => this.onCancel()} />;
    }

    renderScript(script) {
        const { progress, deviceInfo } = this.props;

        return <AppScreen progress={progress}>{script()}</AppScreen>;
    }

    render() {
        const { progress, deviceInfo } = this.props;
        const { script } = this.state;

        if (script) {
            return this.renderScript(script);
        }

        return <AppScreen progress={progress}>
            <DeviceInfo info={deviceInfo} />
            <ScrollView>
                <MenuButtonContainer style={{ marginBottom: 30 }}>
                    <MenuButton title="pH One-Point" onPress={() => this.startCalibration(SensorType.values.PH, this.phOnePointScript.bind(this))} />
                    <MenuButton title="pH Two-Point" onPress={() => this.startCalibration(SensorType.values.PH, this.phTwoPointScript.bind(this))} />
                    <MenuButton title="pH Three-Point" onPress={() => this.startCalibration(SensorType.values.PH, this.phThreePointScript.bind(this))} />
                    <MenuButton title="Conductivity" onPress={() => this.startCalibration(SensorType.values.EC, this.ecScript.bind(this))} />
                    <MenuButton title="ORP" onPress={() => this.startCalibration(SensorType.values.ORP, this.orpScript.bind(this))} />
                    <MenuButton title="DO One-Point" onPress={() => this.startCalibration(SensorType.values.DO, this.doOnePointScript.bind(this))} />
                    <MenuButton title="DO Two-Point" onPress={() => this.startCalibration(SensorType.values.DO, this.doTwoPointScript.bind(this))} />
                    <MenuButton title="Temperature" onPress={() => this.startCalibration(SensorType.values.DO, this.temperatureScript.bind(this))} />
                </MenuButtonContainer>
            </ScrollView>
        </AppScreen>;
    }
};

AtlasCalibrationScreen.propTypes = {
    atlasCalibrationBegin: PropTypes.func.isRequired,
    atlasCalibrationEnd: PropTypes.func.isRequired,
    atlasReadSensor: PropTypes.func.isRequired,
    timerStart: PropTypes.func.isRequired,
    timerCancel: PropTypes.func.isRequired,
    atlasSensorCommand: PropTypes.func.isRequired,
    atlasSetProbeType: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    atlasCalibrationTemperatureSet: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    progress: PropTypes.object.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    progress: state.progress,
    deviceInfo: state.deviceInfo,
    timer: state.timers.Atlas || { done: false },
    atlasState: state.atlasState,
});

export default connect(mapStateToProps, {
    timerStart,
    timerCancel,
    navigateBack,
    atlasCalibrationBegin,
    atlasCalibrationEnd,
    atlasReadSensor,
    atlasSensorCommand,
    atlasSetProbeType,
    atlasCalibrationTemperatureSet,
    atlasCalibrate,
})(AtlasCalibrationScreen);
