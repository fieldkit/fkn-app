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
        return nextState;
    case ActionTypes.DEVICE_CAPABILITIES_SUCCESS:
        nextState = _.cloneDeep(state);
        nextState.sensors = _.cloneDeep(action.response.capabilities.sensors);
        return nextState;
    case ActionTypes.DEVICE_LIVE_DATA_POLL_SUCCESS:
        nextState = _.cloneDeep(state);

        const bySensor = _.keyBy(action.response.liveData.dataSetDatas, ds => ds.sensor);

        _.forEach(nextState.sensors, sensor => {
            if (bySensor[sensor.id]) {
                const data = bySensor[sensor.id];
                if (_.isArray(data.floats) && data.floats.length > 0) {
                    sensor.value = data.floats[data.floats.length - 1];
                }
                else {
                    sensor.value = "N/A";
                }
            }
            else {
                sensor.value = "N/A";
            }
        });

        return nextState;
    default:
        return nextState;
    }
}
