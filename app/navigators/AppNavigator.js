import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import WelcomeScreen from '../containers/WelcomeScreen';
import AboutScreen from '../containers/AboutScreen';
import ConnectingScreen from '../containers/ConnectingScreen';
import DeviceMenuScreen from '../containers/DeviceMenuScreen';

export const AppNavigator = StackNavigator({
    Welcome: {
        path: '/',
        screen: WelcomeScreen
    },
    Connecting: {
        path: '/connecting',
        screen: ConnectingScreen
    },
    DeviceMenu: {
        path: '/device',
        screen: DeviceMenuScreen
    },
    About: {
        path: '/about',
        screen: AboutScreen
    },
});

const AppWithNavigationState = ({ dispatch, nav }) => (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
