import { PluginManager } from './app/plugins/plugin-manager';
import { AtlasPlugin } from './app/plugins/atlas/atlas-plugin';

import { routesManager } from './app/navigators/routes';

export const pluginManager = new PluginManager();
export const atlasPlugin = new AtlasPlugin();

pluginManager.register(atlasPlugin);

routesManager.register(pluginManager.getRoutes());
