import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { SensorType, atlasSensorQuery, encodeWireAtlasQuery, decodeWireAtlasReply } from './protocol';

import styles from '../../styles';

export class ScriptButtons extends React.Component {
    render() {
        const { canMoveNext, lastStep, onMoveNextStep, onCancel } = this.props;

        if (lastStep) {
            return <View><Button title="Done" onPress={() => onCancel()} /></View>;
        }

        return <View>
            <Button title="Next" onPress={() => onMoveNextStep()} disabled={!canMoveNext} />
            <Button title="Cancel" onPress={() => onCancel()} />
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

        return (
            <View>
                {this.renderStep()}
                <View>{children}</View>
                <ScriptButtons {...props} canMoveNext={this.canMoveNext()} />
            </View>
        );
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
        return <Text>{timer.remaining} Seconds</Text>;
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
