import WelcomeScreen from "../containers/WelcomeScreen";
import AboutScreen from "../containers/AboutScreen";
import ConnectingScreen from "../containers/ConnectingScreen";
import DeviceMenuScreen from "../containers/DeviceMenuScreen";
import SensorsScreen from "../containers/SensorsScreen";
import ConfigureScreen from "../containers/ConfigureScreen";
import NetworkScreen from "../containers/NetworkScreen";
import FilesScreen from "../containers/FilesScreen";
import LiveDataScreen from "../containers/LiveDataScreen";
import BrowserScreen from "../containers/BrowserScreen";
import LocalFileScreen from "../containers/LocalFileScreen";
import EasyModeScreen from "../containers/EasyModeScreen";
import DataTableScreen from "../containers/DataTableScreen";
import MapScreen from "../containers/MapScreen";
import DataMapScreen from "../containers/DataMapScreen";
import EditDeviceName from "../containers/EditDeviceNameScreen";

export class ApplicationRoutesManager {
    constructor() {
        this.routes = {
            Welcome: {
                path: "/",
                screen: WelcomeScreen
            },
            Connecting: {
                path: "/connecting",
                screen: ConnectingScreen
            },
            DeviceMenu: {
                path: "/device",
                screen: DeviceMenuScreen
            },
            Sensors: {
                path: "/sensors",
                screen: SensorsScreen
            },
            Configure: {
                path: "/configure",
                screen: ConfigureScreen
            },
            Network: {
                path: "/network",
                screen: NetworkScreen
            },
            Files: {
                path: "/files",
                screen: FilesScreen
            },
            LiveData: {
                path: "/live-data",
                screen: LiveDataScreen
            },
            About: {
                path: "/about",
                screen: AboutScreen
            },
            EasyModeWelcome: {
                path: "/easy-mode",
                screen: EasyModeScreen
            },
            EditDeviceName: {
                path: "/edit-device-name",
                screen: EditDeviceName
            },
            Browser: {
                path: "/browser",
                screen: BrowserScreen
            },
            LocalFile: {
                path: "/local-file",
                screen: LocalFileScreen
            },
            DataTable: {
                path: "/data-table",
                screen: DataTableScreen
            },
            Map: {
                path: "/map",
                screen: MapScreen
            },
            DataMap: {
                path: "/data-map",
                screen: DataMapScreen
            }
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
