'use strict';

import _ from 'lodash';

import { Plugin } from '../plugin';

import AtlasCalibrationScreen from './AtlasCalibrationScreen';

import * as reducers from './reducers';
import { atlasSagas } from './actions';

export class AtlasPlugin extends Plugin {
    appliesTo(deviceCapabilities) {
        const thatWeHave = _(deviceCapabilities.modules).map(s => s.name).intersection(['Atlas']);
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

    getReducers() {
        return reducers;
    }

    getSagas() {
        return atlasSagas;
    }
};
