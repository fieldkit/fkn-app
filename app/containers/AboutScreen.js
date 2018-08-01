import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Config from '../config';

import { View, Text, Image } from 'react-native';

import { AppScreen, MenuButtonContainer, MenuButton } from '../components';

import { navigateWelcome } from '../actions';

class AboutScreen extends React.Component {
    static navigationOptions = {
        title: 'About',
    };

    render() {
        const { navigateWelcome } = this.props;
        return (
            <AppScreen>
                <Image source={require('../../assets/fk-header.png')}
                    style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: 200,
                    }} />
                <MenuButtonContainer>
                    <MenuButton title="Welcome" onPress={() => navigateWelcome()} />
                    <View>
                      <Text>{Config.build.gitCommit || 'NA'}</Text>
                      <Text>{Config.build.buildTag || 'NA'}</Text>
                      <Text>{Config.build.buildTime || 'NA'}</Text>
                    </View>
                </MenuButtonContainer>
            </AppScreen>
        );
    }
}

AboutScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
    navigateWelcome
})(AboutScreen);
