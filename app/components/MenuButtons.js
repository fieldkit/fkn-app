import React from "react";
import { View, Button } from "react-native";

import styles from "../styles";

export class MenuButtonContainer extends React.Component {
    render() {
        const { children, style } = this.props;

        return <View style={[styles.menuButtonContainer, style]}>{children}</View>;
    }
}

export class MenuButton extends React.Component {
    render() {
        const { title, onPress, color } = this.props;

        return (
            <View style={styles.menuButton}>
                <Button title={title} onPress={onPress} color={color} />
            </View>
        );
    }
}
