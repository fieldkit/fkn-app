import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { SensorType } from './protocol';

import { AtlasScript } from './AtlasScript';
import { ScriptStep, InstructionsStep, WaitingStep, AtlasCalibrationCommandStep } from './ScriptSteps';
import { Paragraph, ReadingsDisplay } from './Components';

import atlasStyles from './styles';

class ConductivityProbeTypeStep extends ScriptStep {
    onSetProbe(k) {
        const { atlasSetProbeType } = this.props;

        atlasSetProbeType(SensorType.values.EC, "K," + k);
    }

    componentWillReceiveProps(nextProps) {
        const { atlasState, onMoveNextStep } = this.props;

        if (atlasState.probeConfiguration.done) {
            onMoveNextStep();
        }
    }

    canMoveNext() {
        const { atlasState } = this.props;

        return atlasState.probeConfiguration.done;
    }

    renderStep() {
        const { atlasState } = this.props;

        return <View>
            <ReadingsDisplay atlasState={atlasState} />

            <Paragraph>Please select the probe you're using.</Paragraph>

            <View style={atlasStyles.buttons.largeButton}><Button title="0.1" onPress={() => this.onSetProbe(0.1) }/></View>
            <View style={atlasStyles.buttons.largeButton}><Button title="1" onPress={() => this.onSetProbe(1) }/></View>
            <View style={atlasStyles.buttons.largeButton}><Button title="10" onPress={() => this.onSetProbe(10) }/></View>
        </View>;
    }
};

ConductivityProbeTypeStep.propTypes = {
    atlasState: PropTypes.object.isRequired,
};

class TemperatureCompensationStep extends ScriptStep {
    renderStep() {
        return <View>
            <Paragraph>
                Temperature has a significant effect on conductivity readings. The EZO™ Conductivity circuit has its temperature compensation set to 25˚ C as the default. If the calibration solution is not within 5˚ of 25˚ C, check the temperature chart on the side of the calibration bottle, and calibrate to that value.
            </Paragraph>
        </View>;
    }
};

TemperatureCompensationStep.propTypes = {

};

export class AtlasEcScript extends React.Component {
    componentDidMount() {
        const { atlasReadSensor } = this.props;

        atlasReadSensor(SensorType.values.EC);
    }

    render() {
        const { timerStart, timerCancel, atlasCalibrate, onCancel, timer, atlasState, atlasReadSensor, atlasSetProbeType } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>The most important part of calibration is watching the readings during the calibration process.</Paragraph>
            </InstructionsStep>

            <ConductivityProbeTypeStep atlasState={atlasState} atlasSetProbeType={atlasSetProbeType} />

            <InstructionsStep>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>Please ensure that the probe is dry before we perform the dry calibration.</Paragraph>
            </InstructionsStep>

            <AtlasCalibrationCommandStep sensor={SensorType.values.EC} command={"Cal,dry"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>Performing dry calibration.</Paragraph>
            </AtlasCalibrationCommandStep>

            <TemperatureCompensationStep>
                <ReadingsDisplay atlasState={atlasState} />
            </TemperatureCompensationStep>

            <InstructionsStep>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>
                    Pour a small amount of the calibration solution into a cup. Shake the probe to make sure you do not have trapped air bubbles in the sensing area. You should see readings that are off by 1 – 40% from the stated value of the calibration solution. Wait for readings to stabilize (small movement from one reading to the next is normal).
                </Paragraph>
                <Paragraph>You cannot calibration to zero.</Paragraph>
            </InstructionsStep>

            <WaitingStep delay={30} canSkip={true} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>

            <AtlasCalibrationCommandStep sensor={SensorType.values.EC} command={"Cal,low,1413"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>Performing low point calibration.</Paragraph>
            </AtlasCalibrationCommandStep>

            <InstructionsStep>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>
                    Pour a small amount of the calibration solution into a cup. Shake the probe to make sure you do not have trapped air bubbles in the sensing area. You should see readings that are off by 1 – 40% from the stated value of the calibration solution. Wait for readings to stabilize (small movement from one reading to the next is normal).
                </Paragraph>
                <Paragraph>You cannot calibration to zero.</Paragraph>
            </InstructionsStep>

            <WaitingStep delay={30} canSkip={true} timer={timer} timerStart={timerStart} timerCancel={timerCancel}>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>

            <AtlasCalibrationCommandStep sensor={SensorType.values.EC} command={"Cal,low,12880"} atlasState={atlasState} atlasCalibrate={atlasCalibrate}>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>Performing low point calibration.</Paragraph>
            </AtlasCalibrationCommandStep>

            <InstructionsStep>
                <ReadingsDisplay atlasState={atlasState} />
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
                <Paragraph>You're done. Please review the manual for maintenance procedures and recalibration schedule.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasEcScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    timerCancel: PropTypes.func.isRequired,
    atlasSetProbeType: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasState: PropTypes.object.isRequired,
};

