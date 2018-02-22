import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { SensorType } from './protocol';
import { Paragraph, AtlasScript, ScriptStep, InstructionsStep, WaitingStep, AtlasCalibrationCommandStep } from './AtlasScript';

import atlasStyles from './styles';

export class AtlasOrpScript extends React.Component {
    render() {
        const { timerStart, atlasCalibrate, onCancel, timer, atlasState } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <Paragraph>Remove soaker bottle and place probe in ORP calibration solution.</Paragraph>
            </InstructionsStep>
            <WaitingStep delay={60} timer={timer} timerStart={timerStart}>
                <Paragraph>Let the probe soak in the calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>
            <AtlasCalibrationCommandStep sensor={SensorType.values.ORP} command={"Cal,225"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <Paragraph>Performing calibration.</Paragraph>
            </AtlasCalibrationCommandStep>
            <InstructionsStep>
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
                <Paragraph>You're done. Please review the manual for maintenance procedures and recalibration schedule.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasOrpScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};

