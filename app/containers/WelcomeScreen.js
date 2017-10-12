'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View
} from 'react-native';

import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import {
    navigateConnecting,
    navigateAbout
} from '../actions/nav';

import styles from '../styles';

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    componentDidMount() {
        // TODO: Remove, this is for debugging.
        // this.props.navigateConnecting();
    }

    render() {
        const { navigateConnecting, navigateAbout } = this.props;
        return (
            <View style={styles.mainView}>
                <MenuButtonContainer>
                    <MenuButton title="Connect" onPress={() => navigateConnecting()} />
                    <MenuButton title="About" onPress={() => navigateAbout()} />
                </MenuButtonContainer>
            </View>
        );
    }
}

WelcomeScreen.propTypes = {
    navigateConnecting: PropTypes.func.isRequired,
    navigateAbout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
    navigateConnecting,
    navigateAbout
})(WelcomeScreen);
