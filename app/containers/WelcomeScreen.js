'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Image
} from 'react-native';

import { BackgroundView } from '../components/BackgroundView';
import { MenuButtonContainer, MenuButton } from '../components/MenuButtons';

import {
    navigateConnecting,
    navigateAbout
} from '../actions/navigation';

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
                <BackgroundView>
                     <Image source={require('../../assets/fk-header.png')}
                        style={{
                            resizeMode: 'contain',
                            width: '100%',
                            height: 200,
                        }} />
                    <MenuButtonContainer>
                        <MenuButton title="Connect" onPress={() => navigateConnecting()} />
                        <MenuButton title="About" onPress={() => navigateAbout()} />
                    </MenuButtonContainer>
                </BackgroundView>
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
