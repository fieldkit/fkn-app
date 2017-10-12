'use strict';

import React, { Component } from 'react'
import { View, Image } from 'react-native'

import styles from '../styles';

export class BackgroundView extends React.Component {
    render() {
        const { children } = this.props;

        return (
            <Image
                source={require('../../assets/fk-background.png')} 
                style={{
                    backgroundColor: '#ccc',
                    flex: 1,
                    resizeMode: 'cover',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}>
                <View style={this.props.style}>
                    {children}
                </View>
            </Image>
        );
    }
}
