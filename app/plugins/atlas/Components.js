import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import atlasStyles  from './styles';

export class ScriptButtons extends React.Component {
    render() {
        const { canMoveNext, lastStep, onMoveNextStep, onCancel } = this.props;

        if (lastStep) {
            return <View><Button title="Done" onPress={() => onCancel()} /></View>;
        }

        return <View style={atlasStyles.script.buttons.container}>
            <View style={atlasStyles.script.buttons.button}><Button title="Next" onPress={() => onMoveNextStep()} disabled={!canMoveNext} /></View>
            <View style={atlasStyles.script.buttons.button}><Button title="Cancel" onPress={() => onCancel()} /></View>
        </View>;
    }
};

ScriptButtons.propTypes = {
    canMoveNext: PropTypes.bool.isRequired,
    lastStep: PropTypes.bool.isRequired,
    onMoveNextStep: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export class Paragraph extends React.Component {
    render() {
        const { style } = this.props;

        return <Text style={[atlasStyles.script.step.instructions.text, style]}>{this.props.children}</Text>;
    }
};

Paragraph.propTypes = {
};

export class ReadingsDisplay extends React.Component {
    render() {
        const { atlasState } = this.props;
        const { values } = atlasState;

        if (values.length == 0) {
            return <Text style={atlasStyles.readings.text}>Reading...</Text>;
        }

        const display = values.map(v => v.toString()).join(", ");
        return <Text style={atlasStyles.readings.text}>{display}</Text>;
    }
};

ReadingsDisplay.propTypes = {
    atlasState: PropTypes.object.isRequired,
};
