import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import AppWithNavigationState from '../navigators/AppNavigator';

class AppContainer extends React.Component {
    render() {
        return (
            <AppWithNavigationState />
        );
    }
};

export default AppContainer;
