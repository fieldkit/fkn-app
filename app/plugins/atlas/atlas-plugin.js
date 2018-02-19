'use strict';

import _ from 'lodash';

import { Plugin } from '../plugin';

import AtlasCalibrationScreen from './AtlasCalibrationScreen';

export class AtlasPlugin extends Plugin {
    appliesTo(deviceCapabilities) {
        const atlasSensors = ['pH', 'ORP', 'DO', 'Temp'];
        const thatWeHave = _(deviceCapabilities.sensors).map(s => s.name).intersection(atlasSensors);
        return thatWeHave.size() > 0;
    }

    getRoutes() {
        return {
            CalibrateAtlas: {
                title: 'Calibrate',
                path: '/atlas/calibrate',
                screen: AtlasCalibrationScreen
            }
        };
    }
};
