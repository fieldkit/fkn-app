import React from 'react';
import PropTypes from 'prop-types';
import { Platform, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { routesManager } from './routes';

export const AppNavigator = StackNavigator(routesManager.getRoutes(), {
    transitionConfig: () => ({
        transitionSpec: {
            duration: 0,
        }
    })
});

class AppWithNavigationState extends React.Component {
    componentWillMount() {
        if (Platform.OS !== 'android') {
            return;
        }
        BackHandler.addEventListener('hardwareBackPress', () => {
            const { dispatch, nav } = this.props;
            if (nav.routes.length === 1) {
                return false;
            }
            dispatch({ type: 'Navigation/BACK' });
            return true;
        });
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    render() {
        const { dispatch, nav } = this.props;
        const navigation = addNavigationHelpers({
            dispatch,
            state: nav
        });
        return <AppNavigator navigation={navigation} />;
    }
};

AppWithNavigationState.propTypes = {
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
