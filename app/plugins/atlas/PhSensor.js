import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { SensorType } from './protocol';
import { AtlasScript, InstructionsStep, WaitingStep, AtlasCommandStep } from './AtlasScript';

export class AtlasPhOnePointScript extends React.Component {
    render() {
        const { timerStart, deviceModuleQuery, onCancel, timer, atlasReplies } = this.props;

        return <AtlasScript timerStart={timerStart} deviceModuleQuery={deviceModuleQuery} onCancel={() => onCancel()}>
            <InstructionsStep>
                <Text>Remove soaker bottle and rinse off pH probe.</Text>
                <Text>Pour a small amount of the calibration solution into a cup.</Text>
                <Text>Place the probe into the cup.</Text>
            </InstructionsStep>
            <WaitingStep delay={1 * 2} timer={timer}>
                <Text>Let the probe sit in calibration solution untill readings stabalize.</Text>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,mid,7"} replies={atlasReplies}>
                <Text>Calibrating</Text>
            </AtlasCommandStep>
            <InstructionsStep>
                <Text>Do not pour the calibration solution back into the bottle.</Text>
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

        return <AtlasScript timerStart={timerStart} deviceModuleQuery={deviceModuleQuery} onCancel={() => onCancel()}>
            <InstructionsStep>
                <Text>Remove soaker bottle and rinse off pH probe.</Text>
                <Text>Pour a small amount of the calibration solution into a cup.</Text>
                <Text>Place the probe into the cup.</Text>
            </InstructionsStep>
            <WaitingStep delay={1 * 2} timer={timer}>
                <Text>Let the probe sit in calibration solution untill readings stabalize.</Text>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,mid,7"} replies={atlasReplies}>
                <Text>Calibrating</Text>
            </AtlasCommandStep>
            <InstructionsStep>
                <Text>Do not pour the calibration solution back into the bottle.</Text>
            </InstructionsStep>
            <InstructionsStep>
                <Text>Remove soaker bottle and rinse off pH probe.</Text>
                <Text>Pour a small amount of the calibration solution into a cup.</Text>
                <Text>Place the probe into the cup.</Text>
            </InstructionsStep>
            <WaitingStep delay={1 * 2} timer={timer}>
                <Text>Let the probe sit in calibration solution untill readings stabalize.</Text>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,low,4"} replies={atlasReplies}>
                <Text>Calibrating</Text>
            </AtlasCommandStep>
            <InstructionsStep>
                <Text>Do not pour the calibration solution back into the bottle.</Text>
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

        return <AtlasScript timerStart={timerStart} deviceModuleQuery={deviceModuleQuery} onCancel={() => onCancel()}>
            <InstructionsStep>
                <Text>Remove soaker bottle and rinse off pH probe.</Text>
                <Text>Pour a small amount of the calibration solution into a cup.</Text>
                <Text>Place the probe into the cup.</Text>
            </InstructionsStep>
            <WaitingStep delay={1 * 2} timer={timer}>
                <Text>Let the probe sit in calibration solution untill readings stabalize.</Text>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,mid,7"} replies={atlasReplies}>
                <Text>Calibrating</Text>
            </AtlasCommandStep>
            <InstructionsStep>
                <Text>Do not pour the calibration solution back into the bottle.</Text>
            </InstructionsStep>
            <InstructionsStep>
                <Text>Remove soaker bottle and rinse off pH probe.</Text>
                <Text>Pour a small amount of the calibration solution into a cup.</Text>
                <Text>Place the probe into the cup.</Text>
            </InstructionsStep>
            <WaitingStep delay={1 * 2} timer={timer}>
                <Text>Let the probe sit in calibration solution untill readings stabalize.</Text>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,low,4"} replies={atlasReplies}>
                <Text>Calibrating</Text>
            </AtlasCommandStep>
            <InstructionsStep>
                <Text>Do not pour the calibration solution back into the bottle.</Text>
            </InstructionsStep>
            <InstructionsStep>
                <Text>Remove soaker bottle and rinse off pH probe.</Text>
                <Text>Pour a small amount of the calibration solution into a cup.</Text>
                <Text>Place the probe into the cup.</Text>
            </InstructionsStep>
            <WaitingStep delay={1 * 2} timer={timer}>
                <Text>Let the probe sit in calibration solution untill readings stabalize.</Text>
            </WaitingStep>
            <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,high,10"} replies={atlasReplies}>
                <Text>Calibrating</Text>
            </AtlasCommandStep>
            <InstructionsStep>
                <Text>Do not pour the calibration solution back into the bottle.</Text>
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
