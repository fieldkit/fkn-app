import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, Text, Image } from 'react-native';

import { AppScreen, MenuButtonContainer, MenuButton } from '../components';

import { navigateWelcome } from '../actions';

class AboutScreen extends React.Component {
    static navigationOptions = {
        title: 'About',
    };

    render() {
        const { progress, navigateWelcome } = this.props;
        return (
            <AppScreen progress={progress}>
                <Image source={require('../../assets/fk-header.png')}
                    style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: 200,
                    }} />
                <MenuButtonContainer>
                    <MenuButton title="Welcome" onPress={() => navigateWelcome()} />
                </MenuButtonContainer>
            </AppScreen>
        );
    }
}

AboutScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired,
    progress: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    progress: state.progress,
});

export default connect(mapStateToProps, {
    navigateWelcome
})(AboutScreen);
