'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Text
} from 'react-native'

import { BackgroundView } from '../components/BackgroundView';
import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import {
    navigateWelcome
} from '../actions/nav';

class AboutScreen extends React.Component {
    static navigationOptions = {
        title: 'About',
    };

    render() {
        const { navigateWelcome } = this.props;
        return (
            <BackgroundView>
                <MenuButtonContainer>
                    <MenuButton title="Welcome" onPress={() => navigateWelcome()} />
                </MenuButtonContainer>
            </BackgroundView>
        );
    }
}

AboutScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
    navigateWelcome
})(AboutScreen);
