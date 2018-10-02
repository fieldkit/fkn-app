import React from 'react';

import { View, Text } from 'react-native';
import styles from '../styles';

export class Loading extends React.Component {
    render() {
        return (
            <View>
                <Text style={styles.loading}>Loading...</Text>
            </View>
        );
    }
}
