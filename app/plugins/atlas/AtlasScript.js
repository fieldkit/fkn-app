import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { ProgressBar } from '../../components';

export class AtlasScript extends React.Component {
    state = {
        currentStepIndex: 0,
    }

    currentStep() {
        const { children } = this.props;
        const { currentStepIndex } = this.state;

        return children[currentStepIndex];
    }

    isLastStep() {
        const { currentStepIndex } = this.state;
        const { children } = this.props;

        return currentStepIndex + 1 == children.length;
    }

    onMoveNextStep() {
        const { currentStepIndex } = this.state;

        this.setState({
            currentStepIndex: currentStepIndex + 1,
        });
    }

    render() {
        const { timerStart, deviceModuleQuery, onCancel, children } = this.props;
        const { currentStepIndex } = this.state;

        const step = this.currentStep();
        const lastStep = this.isLastStep();

        const childProps = {
            lastStep: lastStep,
            onMoveNextStep: this.onMoveNextStep.bind(this),
            onCancel: onCancel,
        };

        return <View style={{ margin: 20 }}>
            <ProgressBar progress={((currentStepIndex + 1) / children.length) * 100.0} />
            {React.cloneElement(step, { ...childProps })}
        </View>;
    }
};

AtlasScript.propTypes = {
    onCancel: PropTypes.func.isRequired,
};
