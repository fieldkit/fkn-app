import React, { Component } from 'react'
import PropTypes from 'prop-types';

import {
    View,
    Text,
    Button
} from 'react-native'

class AboutScreen extends React.Component {
    static navigationOptions = {
        title: 'About',
    };

    render() {
        const navigation = this.props.navigation;
        return (
            <View>
                <Button title="Welcome" onPress={() => navigation.dispatch({ type: 'Welcome' })} />
                <Text>
                    Hello
                </Text>
            </View>
        );
    }
}

AboutScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default AboutScreen
