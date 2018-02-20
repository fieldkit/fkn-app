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

    getReducers() {
        return _(this.plugins).map(p => p.getReducers()).reduce((res, value, key) => {
            return Object.assign(res, value);
        }, {});
    }

    getSagas() {
        return _(this.plugins).map(p => p.getSagas()).value();
    }

    getActivePlugins(capabilities) {
        return _(this.plugins).filter(p => p.appliesTo(capabilities)).value();
    }
};
