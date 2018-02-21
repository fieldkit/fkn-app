import { PluginManager } from './plugins/plugin-manager';
import { AtlasPlugin } from './plugins/atlas/atlas-plugin';
import { routesManager } from './navigators/routes';

export const pluginManager = new PluginManager();
export const atlasPlugin = new AtlasPlugin();

pluginManager.register(atlasPlugin);

routesManager.register(pluginManager.getRoutes());
