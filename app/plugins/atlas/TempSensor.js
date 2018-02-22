import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { SensorType } from './protocol';
import { Paragraph, AtlasScript, ScriptStep, InstructionsStep, WaitingStep, AtlasCalibrationCommandStep } from './AtlasScript';

import atlasStyles from './styles';

export class AtlasTemperatureScript extends React.Component {
    render() {
        const { timerStart, atlasCalibrate, onCancel, timer, atlasState } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <Paragraph>Boil some water and place the probe in.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={5} timer={timer} timerStart={timerStart}>
                <Paragraph>Let the probe soak for a few seconds.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.ORP} command={"Cal,100"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Performing calibration.</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>You're done. Please review the manual for maintenance procedures and recalibration schedule.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasTemperatureScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};
