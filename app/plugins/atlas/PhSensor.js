import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { SensorType } from './protocol';

import { AtlasScript } from './AtlasScript';
import { InstructionsStep, WaitingStep, AtlasCalibrationCommandStep } from './ScriptSteps';
import { Paragraph } from './Components';

import atlasStyles from './styles';

const phDelay = 60 * 2;

export class AtlasPhOnePointScript extends React.Component {
    render() {
        const { timerStart, timerCancel, atlasCalibrate, onCancel, timer, atlasState } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <Paragraph>Remove soaker bottle and rinse off pH probe.</Paragraph>
                <Paragraph>Pour a small amount of the calibration solution into a cup.</Paragraph>
                <Paragraph>Place the probe into the cup.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.PH} command={"Cal,mid,7"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Calibrating</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
                <Paragraph>You're done. Please review the manual for maintenance procedures and recalibration schedule.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasPhOnePointScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    timerCancel: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};

export class AtlasPhTwoPointScript extends React.Component {
    render() {
        const { timerStart, timerCancel, atlasCalibrate, onCancel, timer, atlasState } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <Paragraph>Remove soaker bottle and rinse off pH probe.</Paragraph>
                <Paragraph>Pour a small amount of the calibration solution into a cup.</Paragraph>
                <Paragraph>Place the probe into the cup.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.PH} command={"Cal,mid,7"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Calibrating</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
            </InstructionsStep>

            <InstructionsStep>
                <Paragraph>Remove soaker bottle and rinse off pH probe.</Paragraph>
                <Paragraph>Pour a small amount of the calibration solution into a cup.</Paragraph>
                <Paragraph>Place the probe into the cup.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.PH} command={"Cal,low,4"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Calibrating</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
                <Paragraph>You're done. Please review the manual for maintenance procedures and recalibration schedule.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasPhTwoPointScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    timerCancel: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};

export class AtlasPhThreePointScript extends React.Component {
    render() {
        const { timerStart, timerCancel, atlasCalibrate, onCancel, timer, atlasState } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <Paragraph>Remove soaker bottle and rinse off pH probe.</Paragraph>
                <Paragraph>Pour a small amount of the calibration solution into a cup.</Paragraph>
                <Paragraph>Place the probe into the cup.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.PH} command={"Cal,mid,7"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Calibrating</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
            </InstructionsStep>

            <InstructionsStep>
                <Paragraph>Remove soaker bottle and rinse off pH probe.</Paragraph>
                <Paragraph>Pour a small amount of the calibration solution into a cup.</Paragraph>
                <Paragraph>Place the probe into the cup.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.PH} command={"Cal,low,4"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Calibrating</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
            </InstructionsStep>

            <InstructionsStep>
                <Paragraph>Remove soaker bottle and rinse off pH probe.</Paragraph>
                <Paragraph>Pour a small amount of the calibration solution into a cup.</Paragraph>
                <Paragraph>Place the probe into the cup.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.PH} command={"Cal,high,10"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Calibrating</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
                <Paragraph>You're done. Please review the manual for maintenance procedures and recalibration schedule.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasPhThreePointScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    timerCancel: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};
