'use strict';

export function unixNow() {
    return Math.round((new Date()).getTime() / 1000);
}
