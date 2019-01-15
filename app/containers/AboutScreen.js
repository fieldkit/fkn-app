import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RNLanguages from 'react-native-languages';

import i18n from '../internationalization/i18n';

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
                    <MenuButton title={i18n.t('about.welcome')} onPress={() => navigateWelcome()} />
                    <View>
                      <Text style={{ fontWeight: 'bold' }}>{i18n.t('about.commit')}</Text>
                      <Text>{Config.build.gitCommit || 'NA'}</Text>
                      <Text style={{ fontWeight: 'bold' }}>{i18n.t('about.tag')}</Text>
                      <Text>{Config.build.buildTag || 'NA'}</Text>
                      <Text style={{ fontWeight: 'bold' }}>{i18n.t('about.time')}</Text>
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
