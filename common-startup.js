import _ from 'lodash';

import { all } from 'redux-saga/effects';

import { PluginManager } from './app/plugins/plugin-manager';
import { AtlasPlugin } from './app/plugins/atlas/atlas-plugin';
import { routesManager } from './app/navigators/routes';
import { rootSaga } from './app/actions/sagas';

export const pluginManager = new PluginManager();
export const atlasPlugin = new AtlasPlugin();

pluginManager.register(atlasPlugin);

routesManager.register(pluginManager.getRoutes());

export function* allSagas() {
    const pluginSagas = pluginManager.getSagas();
    const invoked = _(pluginSagas).concat([ rootSaga ]).map(s => s()).value();
    yield all(invoked);
}
