import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';

import { AppScreen, MenuButtonContainer, MenuButton } from '../components';

import { navigateConnecting, navigateBrowser, navigateAbout, deviceStartConnect, deviceStopConnect } from '../actions';

import styles from '../styles';

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    componentDidMount() {
        // This will cause tests to take forever, they'll wait until the saga to
        // look completes. A quick hack, for now.
        if (typeof __SPECS__ == 'undefined') {
            this.props.deviceStartConnect();
        }
    }

    render() {
        const { progress, navigateConnecting, navigateBrowser, navigateAbout } = this.props;

        return (
            <AppScreen progress={progress}>
                <Image source={require('../../assets/fk-header.png')}
                    style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: 200,
                    }} />
                <MenuButtonContainer>
                    <MenuButton title="Connect" onPress={() => navigateConnecting()} />
                    <MenuButton title="Browser" onPress={() => navigateBrowser()} />
                    <MenuButton title="About" onPress={() => navigateAbout()} />
                </MenuButtonContainer>
            </AppScreen>
        );
    }
}

WelcomeScreen.propTypes = {
    navigateConnecting: PropTypes.func.isRequired,
    navigateBrowser: PropTypes.func.isRequired,
    navigateAbout: PropTypes.func.isRequired,
    deviceStartConnect: PropTypes.func.isRequired,
    progress: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    progress: state.progress,
});

export default connect(mapStateToProps, {
    navigateConnecting,
    navigateBrowser,
    navigateAbout,
    deviceStartConnect
})(WelcomeScreen);
