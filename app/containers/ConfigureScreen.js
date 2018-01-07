'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View } from 'react-native'

import { BackgroundView } from '../components/BackgroundView';
import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import { navigateNetwork, navigateBack } from '../actions/navigation';

import Loading from '../components/Loading';
import DeviceInfo from '../components/DeviceInfo';

import styles from '../styles';

class ConfigureScreen extends React.Component {
    static navigationOptions = {
        title: 'Configure',
    };

    render() {
        const { deviceInfo } = this.props;

        return (
            <BackgroundView>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title="Network" onPress={() => this.props.navigateNetwork()} />
                    <MenuButton title="Back" onPress={() => this.props.navigateBack()} />
                </MenuButtonContainer>
            </BackgroundView>
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
