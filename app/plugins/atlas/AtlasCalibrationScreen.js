import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Button } from 'react-native';

import { AppScreen, DeviceInfo, MenuButtonContainer, MenuButton } from '../../components';

import { navigateBack, timerStart } from '../../actions';

import { atlasCalibrationBegin, atlasCalibrationEnd, atlasReadSensor, atlasSensorCommand, atlasSetProbeType, atlasCalibrate } from './actions';

import { SensorType } from './protocol';

import { AtlasPhOnePointScript, AtlasPhTwoPointScript, AtlasPhThreePointScript } from './PhSensor';
import { AtlasEcScript } from './EcSensor';

class AtlasCalibrationScreen extends React.Component {
    static navigationOptions = {
        title: 'Calibrate',
    };

    state = {
        script: null
    }

    componentDidMount() {
        this.props.atlasCalibrationEnd();
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
        const { timerStart, atlasCalibrate, timer, atlasCalibration } = this.props;

        return <AtlasPhOnePointScript timerStart={timerStart} atlasCalibrate={atlasCalibrate} timer={timer} atlasCalibration={atlasCalibration} onCancel={() => this.onCancel()} />;
    }

    phTwoPointScript() {
        const { timerStart, atlasCalibrate, timer, atlasCalibration } = this.props;

        return <AtlasPhTwoPointScript timerStart={timerStart} atlasCalibrate={atlasCalibrate} timer={timer} atlasCalibration={atlasCalibration} onCancel={() => this.onCancel()} />;
    }

    phThreePointScript() {
        const { timerStart, atlasCalibrate, timer, atlasCalibration } = this.props;

        return <AtlasPhThreePointScript timerStart={timerStart} atlasCalibrate={atlasCalibrate} timer={timer} atlasCalibration={atlasCalibration} onCancel={() => this.onCancel()} />;
    }

    ecScript() {
        const { timerStart, atlasCalibrate, timer, atlasCalibration, atlasReadSensor, atlasSetProbeType } = this.props;

        return <AtlasEcScript timerStart={timerStart} atlasCalibrate={atlasCalibrate} timer={timer} atlasCalibration={atlasCalibration} onCancel={() => this.onCancel()} atlasReadSensor={atlasReadSensor} atlasSetProbeType={atlasSetProbeType } />;
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
            <MenuButtonContainer>
                <MenuButton title="pH One-Point" onPress={() => this.startCalibration(SensorType.values.PH, this.phOnePointScript.bind(this))} />
                <MenuButton title="pH Two-Point" onPress={() => this.startCalibration(SensorType.values.PH, this.phTwoPointScript.bind(this))} />
                <MenuButton title="pH Three-Point" onPress={() => this.startCalibration(SensorType.values.PH, this.phThreePointScript.bind(this))} />
                <MenuButton title="Conductivity" onPress={() => this.startCalibration(SensorType.values.EC, this.ecScript.bind(this))} />
                <MenuButton title="Back" onPress={() => this.props.navigateBack()} />
            </MenuButtonContainer>
        </AppScreen>;
    }
};

AtlasCalibrationScreen.propTypes = {
    atlasCalibrationBegin: PropTypes.func.isRequired,
    atlasCalibrationEnd: PropTypes.func.isRequired,
    atlasReadSensor: PropTypes.func.isRequired,
    timerStart: PropTypes.func.isRequired,
    atlasSensorCommand: PropTypes.func.isRequired,
    atlasSetProbeType: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,

    progress: PropTypes.object.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    atlasCalibration: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    progress: state.progress,
    deviceInfo: state.deviceInfo,
    timer: state.timers.Atlas || { done: false },
    atlasCalibration: state.atlasCalibration,
});

export default connect(mapStateToProps, {
    timerStart,
    navigateBack,
    atlasCalibrationBegin,
    atlasCalibrationEnd,
    atlasReadSensor,
    atlasSensorCommand,
    atlasSetProbeType,
    atlasCalibrate,
})(AtlasCalibrationScreen);
