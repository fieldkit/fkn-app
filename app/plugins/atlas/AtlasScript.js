import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { SensorType } from './protocol';

import styles from '../../styles';
import atlasStyles  from './styles';

export class ScriptButtons extends React.Component {
    render() {
        const { canMoveNext, lastStep, onMoveNextStep, onCancel } = this.props;

        if (lastStep) {
            return <View><Button title="Done" onPress={() => onCancel()} /></View>;
        }

        return <View style={atlasStyles.script.buttons.container}>
            <View style={atlasStyles.script.buttons.button}><Button title="Next" onPress={() => onMoveNextStep()} disabled={!canMoveNext} /></View>
            <View style={atlasStyles.script.buttons.button}><Button title="Cancel" onPress={() => onCancel()} /></View>
        </View>;
    }
};

ScriptButtons.propTypes = {
    canMoveNext: PropTypes.bool.isRequired,
    lastStep: PropTypes.bool.isRequired,
    onMoveNextStep: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export class ScriptStep extends React.Component {
    canMoveNext() {
        return true;
    }

    render() {
        const { children } = this.props;
        const props = this.props;
        const canMoveNext = this.canMoveNext();

        return <View style={atlasStyles.script.step.container}>
            {this.renderStep()}
            <View style={atlasStyles.script.step.children.container}>{children}</View>
            <ScriptButtons {...props} canMoveNext={canMoveNext} />
        </View>;
    }

    renderStep() {
        return <View></View>;
    }
};

ScriptStep.propTypes = {
};

export class InstructionsStep extends ScriptStep {

};

InstructionsStep.propTypes = {
};

export class WaitingStep extends ScriptStep {
    state = {
        skipped: false
    }

    componentDidMount() {
        const { timerStart, delay } = this.props;

        timerStart('Atlas', delay);
    }

    canMoveNext() {
        const { timer } = this.props;
        const { skipped } = this.state;

        return (timer && timer.done) || skipped;
    }

    onSkipped() {
        this.setState({
            skipped: true
        });
    }

    renderStep() {
        const { timer } = this.props;

        if (!timer) {
            return <View></View>;
        }
        return <Text style={atlasStyles.script.step.waiting.remaining} onPress={() => this.onSkipped()}>{timer.remaining} Seconds</Text>;
    }
};

WaitingStep.propTypes = {
    timerStart: PropTypes.func.isRequired,
    delay: PropTypes.number.isRequired,
};

export class AtlasCalibrationCommandStep extends ScriptStep {
    componentDidMount() {
        this.onRetry();
    }

    onRetry() {
        const { atlasCalibrate, sensor, command } = this.props;

        atlasCalibrate(sensor, command);
    }

    canMoveNext() {
        const { atlasState } = this.props;

        return atlasState.calibration.done;
    }

    renderStep() {
        const { command, atlasState } = this.props;
        const { calibration } = atlasState;

        const r = [
            <Text key={0} style={atlasStyles.script.step.command.command}>{command}</Text>
        ];

        console.log(calibration);

        if (!calibration.pending) {
            if (calibration.error) {
                r.push(<Text key={r.length} style={atlasStyles.script.step.command.failed}>Failed!</Text>);
            }
            else {
                r.push(<Text key={r.length} style={atlasStyles.script.step.command.success}>Success!</Text>);
            }

            if (!calibration.done) {
                r.push(<Button key={r.length} title="Retry" onPress={() => this.onRetry()} />);
            }
        }

        return <View>{r}</View>;
    }
};

AtlasCalibrationCommandStep.propTypes = {
    atlasCalibrate: PropTypes.func.isRequired,
    atlasState: PropTypes.object.isRequired,
    sensor: PropTypes.number.isRequired,
    command: PropTypes.string.isRequired,
};

export class Paragraph extends React.Component {
    render() {
        return <Text style={atlasStyles.script.step.instructions.text}>{this.props.children}</Text>;
    }
};

Paragraph.propTypes = {
};

export class AtlasScript extends React.Component {
    state = {
        currentStepIndex: 0,
    }

    currentStep() {
        const { children } = this.props;
        const { currentStepIndex } = this.state;

        return children[currentStepIndex];
    }

    onMoveNextStep() {
        const { currentStepIndex } = this.state;

        this.setState({
            currentStepIndex: currentStepIndex + 1,
        });
    }

    isLastStep() {
        const { currentStepIndex } = this.state;
        const { children } = this.props;

        return currentStepIndex + 1 == children.length;
    }

    render() {
        const { timerStart, deviceModuleQuery, onCancel } = this.props;
        const step = this.currentStep();
        const lastStep = this.isLastStep();

        const newProps = {
            lastStep: lastStep,
            onMoveNextStep: this.onMoveNextStep.bind(this),
            onCancel: onCancel,
        };

        return React.cloneElement(step, { ...newProps });
    }
};

AtlasScript.propTypes = {
    onCancel: PropTypes.func.isRequired,
};
