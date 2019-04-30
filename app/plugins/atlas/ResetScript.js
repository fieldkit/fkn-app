import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, TextButton } from "react-native";

import { SensorType } from "./protocol";

import { AtlasScript } from "./AtlasScript";
import { InstructionsStep, AtlasCalibrationCommandStep } from "./ScriptSteps";
import { Paragraph } from "./Components";

import atlasStyles from "./styles";

export class ResetScript extends React.Component {
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
                <AtlasCalibrationCommandStep
                    sensor={SensorType.values.PH}
                    command={atlasState.commands.Ph.Clear}
                    atlasState={atlasState}
                    atlasCalibrate={atlasCalibrate}
                >
                    <Paragraph>Clearing calibration.</Paragraph>
                </AtlasCalibrationCommandStep>
                <AtlasCalibrationCommandStep
                    sensor={SensorType.values.TEMP}
                    command={atlasState.commands.Temperature.Clear}
                    atlasState={atlasState}
                    atlasCalibrate={atlasCalibrate}
                >
                    <Paragraph>Clearing calibration.</Paragraph>
                </AtlasCalibrationCommandStep>
                <AtlasCalibrationCommandStep
                    sensor={SensorType.values.ORP}
                    command={atlasState.commands.Orp.Clear}
                    atlasState={atlasState}
                    atlasCalibrate={atlasCalibrate}
                >
                    <Paragraph>Clearing calibration.</Paragraph>
                </AtlasCalibrationCommandStep>
                <AtlasCalibrationCommandStep
                    sensor={SensorType.values.DO}
                    command={atlasState.commands.Do.Clear}
                    atlasState={atlasState}
                    atlasCalibrate={atlasCalibrate}
                >
                    <Paragraph>Clearing calibration.</Paragraph>
                </AtlasCalibrationCommandStep>
                <AtlasCalibrationCommandStep
                    sensor={SensorType.values.EC}
                    command={atlasState.commands.Ec.Clear}
                    atlasState={atlasState}
                    atlasCalibrate={atlasCalibrate}
                >
                    <Paragraph>Clearing calibration.</Paragraph>
                </AtlasCalibrationCommandStep>
            </AtlasScript>
        );
    }
}

ResetScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired
};
