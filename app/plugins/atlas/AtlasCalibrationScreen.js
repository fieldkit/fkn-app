import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Button } from 'react-native';

import { AppScreen, DeviceInfo, MenuButtonContainer, MenuButton } from '../../components';
import { navigateBack, timerStart, deviceModuleQuery } from '../../actions';

import { AtlasPhOnePointScript, AtlasPhTwoPointScript, AtlasPhThreePointScript } from './PhSensor';

import styles from '../../styles';

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

    phOnePointScript() {
        const { timerStart, deviceModuleQuery, timer, atlasReplies } = this.props;

        return <AtlasPhOnePointScript timerStart={timerStart} deviceModuleQuery={deviceModuleQuery} timer={timer} atlasReplies={atlasReplies} onCancel={() => this.onCancel()} />;
    }

    phTwoPointScript() {
        const { timerStart, deviceModuleQuery, timer, atlasReplies } = this.props;

        return <AtlasPhTwoPointScript timerStart={timerStart} deviceModuleQuery={deviceModuleQuery} timer={timer} atlasReplies={atlasReplies} onCancel={() => this.onCancel()} />;
    }

    phThreePointScript() {
        const { timerStart, deviceModuleQuery, timer, atlasReplies } = this.props;

        return <AtlasPhThreePointScript timerStart={timerStart} deviceModuleQuery={deviceModuleQuery} timer={timer} atlasReplies={atlasReplies} onCancel={() => this.onCancel()} />;
    }


    renderScript(script) {
        const { progress, deviceInfo } = this.props;

        return <AppScreen progress={progress}>{script()}</AppScreen>;
    }

    render() {
        const { progress, deviceInfo } = this.props;
        const { script } = this.state;

        if (script) {
            return this.renderScript(script);
        }

        return <AppScreen progress={progress}>
            <DeviceInfo info={deviceInfo} />
            <MenuButtonContainer>
                <MenuButton title="pH One-Point" onPress={() => this.startCalibration(this.phOnePointScript.bind(this))} />
                <MenuButton title="pH Two-Point" onPress={() => this.startCalibration(this.phTwoPointScript.bind(this))} />
                <MenuButton title="pH Three-Point" onPress={() => this.startCalibration(this.phThreePointScript.bind(this))} />
                <MenuButton title="Back" onPress={() => this.props.navigateBack()} />
            </MenuButtonContainer>
        </AppScreen>;
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
    timer: state.timers.Atlas || {},
    atlasReplies: state.atlasReplies,
});

export default connect(mapStateToProps, {
    timerStart,
    deviceModuleQuery,
    navigateBack,
})(AtlasCalibrationScreen);
