import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

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
