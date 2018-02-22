import 'react-native';

import React from 'react';
import TestRenderer from 'react-test-renderer';

import { AtlasPhOnePointScript, AtlasPhTwoPointScript, AtlasPhThreePointScript } from './PhSensor';

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
                commands: atlasCommands.getCommands(25),
            },
            timerStart: jest.fn(),
            timerCancel: jest.fn(),
            atlasCalibrate: jest.fn(),
            atlasReadSensor: jest.fn(),
            onCancel: jest.fn(),
        };
    });

    describe('PH One Point', () => {
        it('renders', () => {
            const tree = TestRenderer.create(<AtlasPhOnePointScript {...props} />);

            console.log(tree.toJSON());
        });
    });

    describe('PH Two Point', () => {
        it('renders', () => {
            const tree = TestRenderer.create(<AtlasPhTwoPointScript {...props} />);

            console.log(tree.toJSON());
        });
    });

    describe('PH Three Point', () => {
        it('renders', () => {
            const tree = TestRenderer.create(<AtlasPhThreePointScript {...props} />);

            console.log(tree.toJSON());
        });
    });
});
