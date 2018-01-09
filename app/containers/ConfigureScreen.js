'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AppScreen, DeviceInfo, MenuButtonContainer, MenuButton } from '../components';

import { navigateNetwork, navigateBack } from '../actions/navigation';

import styles from '../styles';

class ConfigureScreen extends React.Component {
    static navigationOptions = {
        title: 'Configure',
    };

    render() {
        const { deviceInfo } = this.props;

        return (
            <AppScreen>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title="Network" onPress={() => this.props.navigateNetwork()} />
                    <MenuButton title="Back" onPress={() => this.props.navigateBack()} />
                </MenuButtonContainer>
            </AppScreen>
        );
    }
}

ConfigureScreen.propTypes = {
    navigateNetwork: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceInfo: state.deviceInfo,
});

export default connect(mapStateToProps, {
    navigateNetwork,
    navigateBack
})(ConfigureScreen);
