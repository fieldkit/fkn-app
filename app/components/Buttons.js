import React from "react";
import { View, Button } from "react-native";

import styles from "../styles";

export class SmallButton extends React.Component {
    render() {
        const { title, onPress, color } = this.props;

        return (
            <View style={styles.buttons.small}>
                <Button title={title} onPress={onPress} color={color} />
            </View>
        );
    }
}
