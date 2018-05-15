import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';

import { AppScreen, MenuButtonContainer, MenuButton } from '../components';

import { navigateConnecting, browseDirectory, navigateBrowser, navigateAbout, deviceStartConnect, deviceStopConnect } from '../actions';

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
        const { navigateConnecting, browseDirectory, navigateAbout } = this.props;

        return (
            <AppScreen>
                <Image source={require('../../assets/fk-header.png')}
                    style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: 200,
                    }} />
                <MenuButtonContainer>
                    <MenuButton title="Connect" onPress={() => navigateConnecting()} />
                    <MenuButton title="Browser" onPress={() => browseDirectory('/')} />
                    <MenuButton title="About" onPress={() => navigateAbout()} />
                </MenuButtonContainer>
            </AppScreen>
        );
    }
}

WelcomeScreen.propTypes = {
    navigateConnecting: PropTypes.func.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    navigateAbout: PropTypes.func.isRequired,
    deviceStartConnect: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
    navigateConnecting,
    navigateAbout,
    browseDirectory,
    deviceStartConnect
})(WelcomeScreen);
