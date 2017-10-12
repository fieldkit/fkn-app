'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Text,
    Image
} from 'react-native'

import { BackgroundView } from '../components/BackgroundView';
import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import {
    navigateWelcome
} from '../actions/navigation';

class AboutScreen extends React.Component {
    static navigationOptions = {
        title: 'About',
    };

    render() {
        const { navigateWelcome } = this.props;
        return (
            <BackgroundView>
                <Image source={require('../../assets/fk-header.png')}
                    style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: 200,
                    }} />
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
