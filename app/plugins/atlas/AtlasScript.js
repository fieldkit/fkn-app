import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { SensorType, atlasSensorQuery, encodeWireAtlasQuery, decodeWireAtlasReply } from './protocol';

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

export class CalibrationStep extends React.Component {
    canMoveNext() {
        return true;
    }

    render() {
        const props = this.props;
        const { children } = this.props;

        return <View style={atlasStyles.script.step.container}>
            {this.renderStep()}
            <View style={atlasStyles.script.step.children.container}>{children}</View>
            <ScriptButtons {...props} canMoveNext={this.canMoveNext()} />
        </View>;
    }

    renderStep() {
        return <View></View>;
    }
};

export class InstructionsStep extends CalibrationStep {

};

export class WaitingStep extends CalibrationStep {
    componentDidMount() {
        const { timerStart, delay } = this.props;

        timerStart('Atlas', delay);
    }

    canMoveNext() {
        const { timer } = this.props;
        return timer && timer.done;
    }

    renderStep() {
        const { timer } = this.props;
        if (!timer) {
            return <View></View>;
        }
        return <Text style={atlasStyles.script.step.waiting.remaining}>{timer.remaining} Seconds</Text>;
    }
};

export class AtlasCommandStep extends CalibrationStep {
    componentDidMount() {
        const { deviceModuleQuery, sensor, command } = this.props;
        const query = atlasSensorQuery(sensor, command);
        deviceModuleQuery(8, 8, encodeWireAtlasQuery(query));
    }

    canMoveNext() {
        const { replies } = this.props;
        return !replies.failed;
    }

    renderStep() {
        const { command, replies } = this.props;
        const r = [
            <Text key={0} style={atlasStyles.script.step.command.command}>{command}</Text>
        ];
        if (!replies.pending) {
            if (replies.busy || replies.failed) {
                r.push(<Text key={r.length} style={atlasStyles.script.step.command.failed}>Failed!</Text>);
            }
            else {
                r.push(<Text key={r.length} style={atlasStyles.script.step.command.success}>Success!</Text>);
            }
        }
        return <View>{r}</View>;
    }
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
        const { atlasCalibrationStep } = this.props;
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
            canMoveNext: true,
            lastStep: lastStep,
            onMoveNextStep: this.onMoveNextStep.bind(this),
            timerStart: timerStart,
            deviceModuleQuery: deviceModuleQuery,
            onCancel: onCancel,
        };

        return React.cloneElement(step, { ...newProps });
    }
};
