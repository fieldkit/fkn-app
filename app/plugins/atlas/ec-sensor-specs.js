import 'react-native';

import React from 'react';
import TestRenderer from 'react-test-renderer';

import { AtlasEcScript } from './EcSensor';

import { AtlasScript } from './AtlasScript';

import { AtlasCommands } from './AtlasCommands';

const atlasCommands = new AtlasCommands();

describe('Atlas Plugin', () => {
    let props = {};

    beforeEach(() => {
        props = {
            timer: {
            },
            atlasState: {
                values: [],
                commands: atlasCommands.getCommands(25, "1"),
            },
            timerStart: jest.fn(),
            timerCancel: jest.fn(),
            atlasCalibrate: jest.fn(),
            atlasSetProbeType: jest.fn(),
            atlasCalibrationTemperatureSet: jest.fn(),
            atlasReadSensor: jest.fn(),
            onCancel: jest.fn(),
        };
    });

    describe('EC', () => {
        it('renders', () => {
            const tree = TestRenderer.create(<AtlasEcScript {...props} />);

            console.log(tree.toJSON());
        });
    });
});
