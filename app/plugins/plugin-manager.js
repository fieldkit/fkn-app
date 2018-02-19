import _ from 'lodash';

export class PluginManager {
    constructor() {
        this.plugins = [];
    }

    register(plugin) {
        console.log("Registered", plugin);
        this.plugins.push(plugin);
    }

    getRoutes() {
        return _(this.plugins).map(p => p.getRoutes()).reduce((res, value, key) => {
            return Object.assign(res, value);
        }, {});
    }
};
