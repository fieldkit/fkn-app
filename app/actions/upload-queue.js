import _ from 'lodash';

import * as Types from './types';

export function uploadQueue(queue) {
    return {
        type: Types.UPLOAD_QUEUE,
        queue: queue
    };
}

