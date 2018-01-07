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

class NetworkScreen extends React.Component {
    static navigationOptions = {
        title: 'Network',
    };

    render() {
        const { deviceInfo } = this.props;

        return (
            <BackgroundView>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title="Back" onPress={() => this.props.navigateBack()} />
                </MenuButtonContainer>
            </BackgroundView>
        );
    }
}

NetworkScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceInfo: state.deviceInfo,
});

export default connect(mapStateToProps, {
    navigateBack
})(NetworkScreen);
