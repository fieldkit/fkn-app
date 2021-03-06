/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

"use strict";

import React from "react";
import { Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

import type { PressEvent } from "../Types/CoreEventTypes";

type ButtonProps = $ReadOnly<{|
    /**
     * Text to display inside the button
     */
    title: string,

    /**
     * Handler to be called when the user taps the button
     */
    onPress: (event?: PressEvent) => mixed,

    /**
     * If true, doesn't play system sound on touch (Android Only)
     **/
    touchSoundDisabled?: ?boolean,

    /**
     * Color of the text (iOS), or background color of the button (Android)
     */
    color?: ?string,

    /**
     * TV preferred focus (see documentation for the View component).
     */
    hasTVPreferredFocus?: ?boolean,

    /**
     * TV next focus down (see documentation for the View component).
     *
     * @platform android
     */
    nextFocusDown?: ?number,

    /**
     * TV next focus forward (see documentation for the View component).
     *
     * @platform android
     */
    nextFocusForward?: ?number,

    /**
     * TV next focus left (see documentation for the View component).
     *
     * @platform android
     */
    nextFocusLeft?: ?number,

    /**
     * TV next focus right (see documentation for the View component).
     *
     * @platform android
     */
    nextFocusRight?: ?number,

    /**
     * TV next focus up (see documentation for the View component).
     *
     * @platform android
     */
    nextFocusUp?: ?number,

    /**
     * Text to display for blindness accessibility features
     */
    accessibilityLabel?: ?string,

    /**
     * If true, disable all interactions for this component.
     */
    disabled?: ?boolean,

    /**
     * Used to locate this view in end-to-end tests.
     */
    testID?: ?string
|}>;

/**
 * A basic button component that should render nicely on any platform. Supports
 * a minimal level of customization.
 *
 * <center><img src="img/buttonExample.png"></img></center>
 *
 * If this button doesn't look right for your app, you can build your own
 * button using [TouchableOpacity](docs/touchableopacity.html)
 * or [TouchableNativeFeedback](docs/touchablenativefeedback.html).
 * For inspiration, look at the [source code for this button component](https://github.com/facebook/react-native/blob/master/Libraries/Components/Button.js).
 * Or, take a look at the [wide variety of button components built by the community](https://js.coach/react-native?search=button).
 *
 * Example usage:
 *
 * ```
 * import { Button } from 'react-native';
 * ...
 *
 * <Button
 *   onPress={onPressLearnMore}
 *   title="Learn More"
 *   color="#841584"
 *   accessibilityLabel="Learn more about this purple button"
 * />
 * ```
 *
 */

export class Button extends React.Component<ButtonProps> {
    render() {
        const { accessibilityLabel, color, onPress, touchSoundDisabled, title, hasTVPreferredFocus, nextFocusDown, nextFocusForward, nextFocusLeft, nextFocusRight, nextFocusUp, disabled, testID } = this.props;
        const buttonStyles = [styles.button];
        const textStyles = [styles.text];
        if (color) {
            buttonStyles.push({ backgroundColor: color });
        }
        const accessibilityStates = [];
        if (disabled) {
            buttonStyles.push(styles.buttonDisabled);
            textStyles.push(styles.textDisabled);
            accessibilityStates.push("disabled");
        }
        const formattedTitle = Platform.OS === "android" ? title.toUpperCase() : title;
        const Touchable = Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
        return (
            <Touchable
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                accessibilityStates={accessibilityStates}
                hasTVPreferredFocus={hasTVPreferredFocus}
                nextFocusDown={nextFocusDown}
                nextFocusForward={nextFocusForward}
                nextFocusLeft={nextFocusLeft}
                nextFocusRight={nextFocusRight}
                nextFocusUp={nextFocusUp}
                testID={testID}
                disabled={disabled}
                onPress={onPress}
                touchSoundDisabled={touchSoundDisabled}
            >
                <View style={buttonStyles}>
                    <Text style={textStyles} disabled={disabled}>
                        {formattedTitle}
                    </Text>
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    button: Platform.select({
        ios: {
            // Material design blue from https://material.google.com/style/color.html#color-color-palette
            borderRadius: 2,
            borderColor: "#1B80C9",
            borderWidth: 1,
            borderRadius: 50,
            margin: 15,
            width: 200
        },
        android: {
            alignItems: "center",
            borderColor: "#1B80C9",
            borderWidth: 1,
            borderRadius: 50,
            width: 200
        }
    }),
    text: {
        textAlign: "center",
        padding: 8,
        ...Platform.select({
            ios: {
                color: "#1B80C9",
                fontSize: 18
            },
            android: {
                color: "#1B80C9",
                fontWeight: "500"
            }
        })
    },
    buttonDisabled: Platform.select({
        ios: {
            elevation: 0,
            backgroundColor: "#dfdfdf"
        },
        android: {
            elevation: 0,
            backgroundColor: "#dfdfdf"
        }
    }),
    textDisabled: Platform.select({
        ios: {
            color: "#a1a1a1"
        },
        android: {
            color: "#a1a1a1"
        }
    })
});
