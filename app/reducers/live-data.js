'use strict';

import _ from 'lodash';
import * as ActionTypes from '../actions/types';
import { unixNow } from '../lib/helpers';

const initialLiveDataState = {
    sensors: {
    }
};

export function liveData(state = initialLiveDataState, action) {
    let nextState = state;

    switch (action.type) {
    case ActionTypes.LIVE_DATA_POLL_START:
    case ActionTypes.LIVE_DATA_POLL_STOP:
        nextState = _.cloneDeep(state);
        _.forEach(nextState.sensors, sensor => {
            sensor.data = [];
            sensor.value = "N/A";
        });
        return nextState;
    case ActionTypes.DEVICE_CAPABILITIES_SUCCESS:
        nextState = _.cloneDeep(state);
        nextState.sensors = _.cloneDeep(action.response.capabilities.sensors);
        _.forEach(nextState.sensors, sensor => {
            sensor.data = [];
            sensor.value = "N/A";
        });
        return nextState;
    case ActionTypes.DEVICE_LIVE_DATA_POLL_SUCCESS:
        nextState = _.cloneDeep(state);

        const bySensor = _.keyBy(action.response.liveData.samples, sample => sample.sensor || 0);

        _.forEach(nextState.sensors, sensor => {
            if (bySensor[sensor.id]) {
                const data = bySensor[sensor.id];
                sensor.value = data.value,
                sensor.data.push({
                    x: new Date((data.time == 0 ? unixNow() : data.time) * 1000),
                    y: sensor.value
                })

                while (sensor.data.length > 100) {
                    sensor.data.shift();
                }
            }
            else {
                sensor.value = null;
            }
        });

        return nextState;
    default:
        return nextState;
    }
}
