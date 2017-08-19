import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import {
    Animated,
    StyleSheet,
    View,
    Text
} from 'react-native'

import AppWithNavigationState from '../navigators/AppNavigator';

class AppContainer extends Component {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        return (
                <AppWithNavigationState />
        )
    }
}

export default AppContainer
