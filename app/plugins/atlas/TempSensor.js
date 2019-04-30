import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, Button } from "react-native";

import { SensorType } from "./protocol";

import { AtlasScript } from "./AtlasScript";
import {
    InstructionsStep,
    WaitingStep,
    AtlasCalibrationCommandStep
} from "./ScriptSteps";
import { Paragraph } from "./Components";

import atlasStyles from "./styles";

export class AtlasTemperatureScript extends React.Component {
    render() {
        const {
            timerStart,
            timerCancel,
            atlasCalibrate,
            onCancel,
            timer,
            atlasState
        } = this.props;

        return (
            <AtlasScript onCancel={() => onCancel()}>
                <InstructionsStep>
                    <Paragraph>
                        Boil some water and place the probe in.
                    </Paragraph>
                </InstructionsStep>
                <WaitingStep
                    delay={5}
                    timer={timer}
                    timerStart={timerStart}
                    timerCancel={timerCancel}
                >
                    <Paragraph>Let the probe soak for a few seconds.</Paragraph>
                </WaitingStep>
                <AtlasCalibrationCommandStep
                    sensor={SensorType.values.ORP}
                    command={atlasState.commands.Temperature.Calibrate}
                    atlasState={atlasState}
                    atlasCalibrate={atlasCalibrate}
                >
                    <Paragraph>Performing calibration.</Paragraph>
                </AtlasCalibrationCommandStep>
                <InstructionsStep>
                    <Paragraph>
                        You're done. Please review the manual for maintenance
                        procedures and recalibration schedule.
                    </Paragraph>
                </InstructionsStep>
            </AtlasScript>
        );
    }
}

AtlasTemperatureScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    timerCancel: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired
};
