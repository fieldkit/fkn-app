import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { ScriptButtons, AtlasCommandStatus } from './Components';

import atlasStyles  from './styles';

export class ScriptStep extends React.Component {
    canMoveNext() {
        return true;
    }

    isNextVisible() {
        return true;
    }

    render() {
        const { children } = this.props;
        const props = this.props;
        const canMoveNext = this.canMoveNext();
        const showNext = this.isNextVisible();

        return <View style={atlasStyles.step.container}>
            {this.renderStep()}
            <View style={atlasStyles.step.children.container}>{children}</View>
            <ScriptButtons {...props} canMoveNext={canMoveNext} showNext={showNext} />
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

    componentWillUnmount() {
        const { timerCancel } = this.props;

        timerCancel('Atlas');
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
        return <Text style={atlasStyles.step.waiting.remaining} onPress={() => this.onSkipped()}>{timer.remaining} Seconds</Text>;
    }
};

WaitingStep.propTypes = {
    timerStart: PropTypes.func.isRequired,
    timerCancel: PropTypes.func.isRequired,
    delay: PropTypes.number.isRequired,
};

export class AtlasCalibrationCommandStep extends ScriptStep {
    componentDidMount() {
        console.log("Mount", this.props);
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

        console.log("Render", this.props);

        return <View>
            <Text style={atlasStyles.step.command.command}>{command}</Text>
            <AtlasCommandStatus command={calibration} onRetry={() => this.onRetry()} />
        </View>;
    }
};

AtlasCalibrationCommandStep.propTypes = {
    atlasCalibrate: PropTypes.func.isRequired,
    atlasState: PropTypes.object.isRequired,
    sensor: PropTypes.number.isRequired,
    command: PropTypes.string.isRequired,
};
