import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { SensorType } from './protocol';
import { AtlasScript, InstructionsStep, WaitingStep, AtlasCommandStep } from './AtlasScript';

import atlasStyles from './styles';

const phDelay = 60 * 2;

class AtlasText extends React.Component {
    render() {
        return <Text style={atlasStyles.script.step.instructions.text}>{this.props.children}</Text>;
    }
};

export class AtlasPhOnePointScript extends React.Component {
    render() {
        const { timerStart, deviceModuleQuery, onCancel, timer, atlasReplies } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <AtlasText>Remove soaker bottle and rinse off pH probe.</AtlasText>
                <AtlasText>Pour a small amount of the calibration solution into a cup.</AtlasText>
                <AtlasText>Place the probe into the cup.</AtlasText>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart}>
                <AtlasText>Let the probe sit in calibration solution untill readings stabalize.</AtlasText>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,mid,7"} replies={atlasReplies} deviceModuleQuery={deviceModuleQuery}>
                <AtlasText>Calibrating</AtlasText>
            </AtlasCommandStep>
            <InstructionsStep>
                <AtlasText>Do not pour the calibration solution back into the bottle.</AtlasText>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasPhOnePointScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    deviceModuleQuery: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasReplies: PropTypes.object.isRequired,
};

export class AtlasPhTwoPointScript extends React.Component {
    render() {
        const { timerStart, deviceModuleQuery, onCancel, timer, atlasReplies } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <AtlasText>Remove soaker bottle and rinse off pH probe.</AtlasText>
                <AtlasText>Pour a small amount of the calibration solution into a cup.</AtlasText>
                <AtlasText>Place the probe into the cup.</AtlasText>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart}>
                <AtlasText>Let the probe sit in calibration solution untill readings stabalize.</AtlasText>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,mid,7"} replies={atlasReplies} deviceModuleQuery={deviceModuleQuery}>
                <AtlasText>Calibrating</AtlasText>
            </AtlasCommandStep>
            <InstructionsStep>
                <AtlasText>Do not pour the calibration solution back into the bottle.</AtlasText>
            </InstructionsStep>

            <InstructionsStep>
                <AtlasText>Remove soaker bottle and rinse off pH probe.</AtlasText>
                <AtlasText>Pour a small amount of the calibration solution into a cup.</AtlasText>
                <AtlasText>Place the probe into the cup.</AtlasText>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart}>
                <AtlasText>Let the probe sit in calibration solution untill readings stabalize.</AtlasText>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,low,4"} replies={atlasReplies} deviceModuleQuery={deviceModuleQuery}>
                <AtlasText>Calibrating</AtlasText>
            </AtlasCommandStep>
            <InstructionsStep>
                <AtlasText>Do not pour the calibration solution back into the bottle.</AtlasText>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasPhTwoPointScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    deviceModuleQuery: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasReplies: PropTypes.object.isRequired,
};

export class AtlasPhThreePointScript extends React.Component {
    render() {
        const { timerStart, deviceModuleQuery, onCancel, timer, atlasReplies } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <AtlasText>Remove soaker bottle and rinse off pH probe.</AtlasText>
                <AtlasText>Pour a small amount of the calibration solution into a cup.</AtlasText>
                <AtlasText>Place the probe into the cup.</AtlasText>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart}>
                <AtlasText>Let the probe sit in calibration solution untill readings stabalize.</AtlasText>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,mid,7"} replies={atlasReplies} deviceModuleQuery={deviceModuleQuery}>
                <AtlasText>Calibrating</AtlasText>
            </AtlasCommandStep>
            <InstructionsStep>
                <AtlasText>Do not pour the calibration solution back into the bottle.</AtlasText>
            </InstructionsStep>

            <InstructionsStep>
                <AtlasText>Remove soaker bottle and rinse off pH probe.</AtlasText>
                <AtlasText>Pour a small amount of the calibration solution into a cup.</AtlasText>
                <AtlasText>Place the probe into the cup.</AtlasText>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart}>
                <AtlasText>Let the probe sit in calibration solution untill readings stabalize.</AtlasText>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,low,4"} replies={atlasReplies} deviceModuleQuery={deviceModuleQuery}>
                <AtlasText>Calibrating</AtlasText>
            </AtlasCommandStep>
            <InstructionsStep>
                <AtlasText>Do not pour the calibration solution back into the bottle.</AtlasText>
            </InstructionsStep>

            <InstructionsStep>
                <AtlasText>Remove soaker bottle and rinse off pH probe.</AtlasText>
                <AtlasText>Pour a small amount of the calibration solution into a cup.</AtlasText>
                <AtlasText>Place the probe into the cup.</AtlasText>
            </InstructionsStep>
            <WaitingStep delay={phDelay} timer={timer} timerStart={timerStart}>
                <AtlasText>Let the probe sit in calibration solution untill readings stabalize.</AtlasText>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,high,10"} replies={atlasReplies} deviceModuleQuery={deviceModuleQuery}>
                <AtlasText>Calibrating</AtlasText>
            </AtlasCommandStep>
            <InstructionsStep>
                <AtlasText>Do not pour the calibration solution back into the bottle.</AtlasText>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasPhThreePointScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    deviceModuleQuery: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasReplies: PropTypes.object.isRequired,
};
