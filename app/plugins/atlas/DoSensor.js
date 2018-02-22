import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextButton } from 'react-native';

import { SensorType } from './protocol';

import { AtlasScript } from './AtlasScript';
import { InstructionsStep, WaitingStep, AtlasCalibrationCommandStep } from './ScriptSteps';
import { Paragraph } from './Components';

import atlasStyles from './styles';

export class AtlasDoOnePointScript extends React.Component {
    render() {
        const { timerStart, timerCancel, atlasCalibrate, onCancel, timer, atlasState, atlasSetProbeType } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <Paragraph>Pull off and discard cap from the Dissolved Oxygen probe. (Only used to protect probe during shipping).</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={30} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <Paragraph>Let the probe sit exposed to air until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.DO} command={"Cal"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Performing calibration.</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>After calibration is complete you should see readings ~9.09 - 9.1Xmg/L.</Paragraph>
                <Paragraph>You're done. Please review the manual for maintenance procedures and recalibration schedule.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasDoOnePointScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};

export class AtlasDoTwoPointScript extends React.Component {
    render() {
        const { timerStart, timerCancel, atlasCalibrate, onCancel, timer, atlasState, atlasSetProbeType } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <Paragraph>Pull off and discard cap from the Dissolved Oxygen probe. (Only used to protect probe during shipping).</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={30} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <Paragraph>Let the probe sit exposed to air until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.DO} command={"Cal"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Performing calibration.</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>After calibration is complete you should see readings ~9.09 - 9.1Xmg/L.</Paragraph>
            </InstructionsStep>
            <InstructionsStep>
                <Paragraph>Stir the probe in Zero D.O. calibration solution to remove trapped air.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={90} timer={timer} timerStart={timerStart}>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.DO} command={"Cal,0"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Performing calibration.</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
                <Paragraph>You're done. Please review the manual for maintenance procedures, recalibration schedule, and for instructions on how to preserve your remaining calibration fluid.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasDoTwoPointScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    timerCancel: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};
