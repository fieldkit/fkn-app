import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import AppWithNavigationState from '../navigators/AppNavigator';

class AppContainer extends React.Component {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        return (
            <AppWithNavigationState />
        );
    }
};

export default AppContainer;
