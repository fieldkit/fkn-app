import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Button } from 'react-native';

import { AppScreen, DeviceInfo, MenuButtonContainer, MenuButton } from '../../components';
import { navigateBack, timerStart, deviceModuleQuery } from '../../actions';
import { SensorType, atlasSensorQuery, encodeWireAtlasQuery, decodeWireAtlasReply } from './protocol';

import styles from '../../styles';

class ScriptButtons extends React.Component {
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

class CalibrationStep extends React.Component {
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

class InstructionsStep extends CalibrationStep {
};

class WaitingStep extends CalibrationStep {
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

class AtlasCommandStep extends CalibrationStep {
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

class AtlasScript extends React.Component {
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

class AtlasCalibrationScreen extends React.Component {
    static navigationOptions = {
        title: 'Calibrate',
    };

    state = {
        script: null
    }

    startCalibration(script) {
        this.setState({
            script: script
        });
    }

    onCancel() {
        this.setState({
            script: null
        });
    }

    phOneStepScript() {
        const { timerStart, deviceModuleQuery, timer, atlasReplies } = this.props;

        return (
            <AtlasScript timerStart={timerStart} deviceModuleQuery={deviceModuleQuery} onCancel={() => this.onCancel()}>
                <InstructionsStep>
                    <Text>Remove soaker bottle and rinse off pH probe.</Text>
                    <Text>Pour a small amount of the calibration solution into a cup.</Text>
                    <Text>Place the probe into the cup.</Text>
                </InstructionsStep>
                <WaitingStep delay={1 * 2} timer={timer}>
                    <Text>Let the probe sit in calibration solution untill readings stabalize.</Text>
                </WaitingStep>
                <AtlasCommandStep sensor={SensorType.values.SensorType_PH} command={"Cal,mid,7"} replies={atlasReplies}>
                    <Text>Calibrating</Text>
                </AtlasCommandStep>
                <InstructionsStep>
                    <Text>Do not pour the calibration solution back into the bottle.</Text>
                </InstructionsStep>
            </AtlasScript>
        );
    }

    render() {
        const { progress, deviceInfo } = this.props;
        const { script } = this.state;

        if (script) {
            return script();
        }

        return (
            <AppScreen progress={progress}>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title="pH One-Step" onPress={() => this.startCalibration(this.phOneStepScript.bind(this))} />
                    <MenuButton title="Back" onPress={() => this.props.navigateBack()} />
                </MenuButtonContainer>
            </AppScreen>
        );
    }
};

AtlasCalibrationScreen.propTypes = {
    timerStart: PropTypes.func.isRequired,
    deviceModuleQuery: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    progress: PropTypes.object.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    atlasReplies: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    progress: state.progress,
    deviceInfo: state.deviceInfo,
    timer: state.timers.Atlas,
    atlasReplies: state.atlasReplies,
});

export default connect(mapStateToProps, {
    timerStart,
    deviceModuleQuery,
    navigateBack,
})(AtlasCalibrationScreen);
