import React from 'react';
import { View, ImageBackground } from 'react-native';

import styles from '../styles';

export class BackgroundView extends React.Component {
    render() {
        const { children } = this.props;

        return (
            <ImageBackground
                source={require('../../assets/fk-background.png')} 
                style={{
                    width: '100%',
                    height: '100%',
                }}>
                <View style={this.props.style}>
                    {children}
                </View>
            </ImageBackground>
        );
    }
}
