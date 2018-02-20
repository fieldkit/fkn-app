'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AppScreen, DeviceInfo, MenuButtonContainer, MenuButton } from '../../components';

import { navigateBack } from '../../actions/navigation';

import styles from '../../styles';

class AtlasCalibrationScreen extends React.Component {
    static navigationOptions = {
        title: 'Calibrate',
    };

    render() {
        const { progress, deviceInfo } = this.props;

        return (
            <AppScreen progress={progress}>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title="Back" onPress={() => this.props.navigateBack()} />
                </MenuButtonContainer>
            </AppScreen>
        );
    }
};

AtlasCalibrationScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    progress: PropTypes.object.isRequired,
    deviceInfo: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    progress: state.progress,
    deviceInfo: state.deviceInfo,
});

export default connect(mapStateToProps, {
    navigateBack
})(AtlasCalibrationScreen);
