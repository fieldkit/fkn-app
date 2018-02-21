import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { SensorType } from './protocol';
import { Paragraph, AtlasScript, CalibrationStep, InstructionsStep, WaitingStep, AtlasCalibrationCommandStep } from './AtlasScript';

import atlasStyles from './styles';

class ConductivityProbeTypeStep extends CalibrationStep {
    onSetProbe(k) {
        const { atlasSetProbeType } = this.props;

        atlasSetProbeType(SensorType.values.EC, "K," + k);
    }

    componentWillReceiveProps(nextProps) {
        const { atlasCalibration, onMoveNextStep } = this.props;

        if (atlasCalibration.probeConfigured) {
            onMoveNextStep();
        }
    }

    canMoveNext() {
        const { atlasCalibration } = this.props;

        return atlasCalibration.probeConfigured;
    }

    renderStep() {
        const { atlasCalibration } = this.props;

        return <View>
            <ReadingsDisplay atlasCalibration={atlasCalibration} />

            <Paragraph>Please select the probe you're using.</Paragraph>

            <View style={atlasStyles.buttons.largeButton}><Button title="0.1" onPress={() => this.onSetProbe(0.1) }/></View>
            <View style={atlasStyles.buttons.largeButton}><Button title="1" onPress={() => this.onSetProbe(1) }/></View>
            <View style={atlasStyles.buttons.largeButton}><Button title="10" onPress={() => this.onSetProbe(10) }/></View>
        </View>;
    }
};

ConductivityProbeTypeStep.propTypes = {
    atlasCalibration: PropTypes.object.isRequired,
};

class TemperatureCompensationStep extends CalibrationStep {
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

class ReadingsDisplay extends React.Component {
    render() {
        const { atlasCalibration } = this.props;
        const { values } = atlasCalibration;

        const display = values.map(v => v.toString()).join(", ");

        return <View>
            <Text style={atlasStyles.readings.text}>{display}</Text>
        </View>;
    }
};

ReadingsDisplay.propTypes = {
    atlasCalibration: PropTypes.object.isRequired,
};

export class AtlasEcScript extends React.Component {
    componentDidMount() {
        const { atlasReadSensor } = this.props;

        atlasReadSensor(SensorType.values.EC);
    }

    render() {
        const { timerStart, atlasCalibrate, onCancel, timer, atlasCalibration, atlasReadSensor, atlasSetProbeType } = this.props;

        return <AtlasScript onCancel={() => onCancel()}>
            <InstructionsStep>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>The most important part of calibration is watching the readings during the calibration process.</Paragraph>
            </InstructionsStep>

            <ConductivityProbeTypeStep atlasCalibration={atlasCalibration} atlasSetProbeType={atlasSetProbeType} />

            <InstructionsStep>
                <Paragraph>Please ensure that the probe is dry before we perform the dry calibration.</Paragraph>
            </InstructionsStep>

            <AtlasCalibrationCommandStep sensor={SensorType.values.EC} command={"Cal,dry"} atlasCalibration={atlasCalibration} atlasCalibrate={atlasCalibrate}>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>Performing dry calibration.</Paragraph>
            </AtlasCalibrationCommandStep>

            <TemperatureCompensationStep>
            </TemperatureCompensationStep>

            <InstructionsStep>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>
                    Pour a small amount of the calibration solution into a cup. Shake the probe to make sure you do not have trapped air bubbles in the sensing area. You should see readings that are off by 1 – 40% from the stated value of the calibration solution. Wait for readings to stabilize (small movement from one reading to the next is normal).
                </Paragraph>
                <Paragraph>You cannot calibration to zero.</Paragraph>
            </InstructionsStep>

            <WaitingStep delay={30} canSkip={true} timer={timer} timerStart={timerStart}>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>

            <AtlasCalibrationCommandStep sensor={SensorType.values.EC} command={"Cal,low,1413"} atlasCalibration={atlasCalibration} atlasCalibrate={atlasCalibrate}>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>Performing low point calibration.</Paragraph>
            </AtlasCalibrationCommandStep>

            <InstructionsStep>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>
                    Pour a small amount of the calibration solution into a cup. Shake the probe to make sure you do not have trapped air bubbles in the sensing area. You should see readings that are off by 1 – 40% from the stated value of the calibration solution. Wait for readings to stabilize (small movement from one reading to the next is normal).
                </Paragraph>
                <Paragraph>You cannot calibration to zero.</Paragraph>
            </InstructionsStep>

            <WaitingStep delay={30} canSkip={true} timer={timer} timerStart={timerStart}>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>Let the probe sit in calibration solution until readings stabalize.</Paragraph>
            </WaitingStep>

            <AtlasCalibrationCommandStep sensor={SensorType.values.EC} command={"Cal,low,12880"} atlasCalibration={atlasCalibration} atlasCalibrate={atlasCalibrate}>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>Performing low point calibration.</Paragraph>
            </AtlasCalibrationCommandStep>

            <InstructionsStep>
                <ReadingsDisplay atlasCalibration={atlasCalibration} />
                <Paragraph>Do not pour the calibration solution back into the bottle.</Paragraph>
            </InstructionsStep>
        </AtlasScript>;
    }
}

AtlasEcScript.propTypes = {
    timerStart: PropTypes.func.isRequired,
    atlasSetProbeType: PropTypes.func.isRequired,
    atlasCalibrate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    timer: PropTypes.object.isRequired,
    atlasCalibration: PropTypes.object.isRequired,
};

