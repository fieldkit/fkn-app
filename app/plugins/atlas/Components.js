import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import atlasStyles  from './styles';

export class ScriptButtons extends React.Component {
    render() {
        const { canMoveNext, lastStep, showNext, onMoveNextStep, onCancel } = this.props;

        if (lastStep) {
            return <View><Button title="Done" onPress={() => onCancel()} /></View>;
        }

        return <View style={atlasStyles.buttons.container}>
            { showNext && <View style={atlasStyles.buttons.button}><Button title="Next" onPress={() => onMoveNextStep()} disabled={!canMoveNext} /></View>}
            <View style={atlasStyles.buttons.button}><Button title="Cancel" onPress={() => onCancel()} /></View>
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

        return <Text style={[atlasStyles.step.instructions.text, style]}>{this.props.children}</Text>;
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

export class AtlasCommandStatus extends React.Component {
    render() {
        const { command, onRetry } = this.props;

        let retry = <View></View>;
        let message;

        if (!command.pending) {
            if (command.busy) {
                message = <Text style={[atlasStyles.step.command.base, atlasStyles.step.command.busy]}>Busy, try again.</Text>;
            }
            else if (command.error) {
                message = <Text style={[atlasStyles.step.command.base, atlasStyles.step.command.failed]}>An error occured.</Text>;
            }
            else {
                message = <Text style={[atlasStyles.step.command.base, atlasStyles.step.command.success]}>Success</Text>;
            }

            if (!command.done) {
                retry = <Button title="Retry" onPress={() => onRetry()} />;
            }
        }

        return <View>{message}{retry}</View>;
    }
}

AtlasCommandStatus.propTypes = {
    command: PropTypes.object.isRequired,
    onRetry: PropTypes.func,
};
