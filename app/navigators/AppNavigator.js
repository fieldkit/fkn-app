import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import WelcomeScreen from '../containers/WelcomeScreen';
import AboutScreen from '../containers/AboutScreen';
import ConnectingScreen from '../containers/ConnectingScreen';
import DeviceMenuScreen from '../containers/DeviceMenuScreen';
import SensorsScreen from '../containers/SensorsScreen';
import ConfigureScreen from '../containers/ConfigureScreen';
import NetworkScreen from '../containers/NetworkScreen';
import DataSetsScreen from '../containers/DataSetsScreen';
import ViewDataSetScreen from '../containers/ViewDataSetScreen';
import LiveDataScreen from '../containers/LiveDataScreen';

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
    Sensors: {
        path: '/sensors',
        screen: SensorsScreen
    },
    Configure: {
        path: '/configure',
        screen: ConfigureScreen
    },
    Configure: {
        path: '/network',
        screen: NetworkScreen
    },
    DataSets: {
        path: '/data-sets',
        screen: DataSetsScreen
    },
    DataSet: {
        path: '/data-sets/:id',
        screen: ViewDataSetScreen
    },
    LiveData: {
        path: '/live-data',
        screen: LiveDataScreen
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
