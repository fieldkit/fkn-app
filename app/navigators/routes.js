import WelcomeScreen from '../containers/WelcomeScreen';
import AboutScreen from '../containers/AboutScreen';
import ConnectingScreen from '../containers/ConnectingScreen';
import DeviceMenuScreen from '../containers/DeviceMenuScreen';
import SensorsScreen from '../containers/SensorsScreen';
import ConfigureScreen from '../containers/ConfigureScreen';
import NetworkScreen from '../containers/NetworkScreen';
import FilesScreen from '../containers/FilesScreen';
import LiveDataScreen from '../containers/LiveDataScreen';
import BrowserScreen from '../containers/BrowserScreen';
import EasyModeScreen from '../containers/EasyModeScreen';
import DataTableScreen from '../containers/DataTableScreen';

export class ApplicationRoutesManager {
    constructor() {
        this.routes = {
            Welcome: {
                path: '/',
                screen: WelcomeScreen
            },
            Connecting: {
                path: '/connecting',
                screen: ConnectingScreen
            },
            DeviceMenu: {
                path: '/device',
                screen: DeviceMenuScreen
            },
            Sensors: {
                path: '/sensors',
                screen: SensorsScreen
            },
            Configure: {
                path: '/configure',
                screen: ConfigureScreen
            },
            Network: {
                path: '/network',
                screen: NetworkScreen
            },
            Files: {
                path: '/files',
                screen: FilesScreen
            },
            LiveData: {
                path: '/live-data',
                screen: LiveDataScreen
            },
            About: {
                path: '/about',
                screen: AboutScreen
            },
            EasyModeWelcome: {
                path: '/easy-mode',
                screen: EasyModeScreen
            },
            Browser: {
                path: '/browser',
                screen: BrowserScreen
            },
            DataTable: {
                path: '/data-table',
                screen: DataTableScreen
            },
        };
    }

    getRoutes() {
        console.log("Returning routes");
        return this.routes;
    }

    register(routes) {
        console.log("Registering", routes);
        Object.assign(this.routes, routes);
    }
}

export const routesManager = new ApplicationRoutesManager();
