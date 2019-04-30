import * as Types from "./types";
import { NavigationActions } from "react-navigation";

export function navigateWelcome() {
  return NavigationActions.navigate({ routeName: "Welcome" });
}

export function navigateMap() {
  return NavigationActions.navigate({ routeName: "Map" });
}

export function navigateDataMap(path) {
  return NavigationActions.navigate({
    routeName: "DataMap",
    params: { path: path }
  });
}

export function navigateConnecting() {
  return NavigationActions.navigate({ routeName: "Connecting" });
}

export function navigateDeviceMenu() {
  return NavigationActions.navigate({ routeName: "DeviceMenu" });
}

export function navigateSensors() {
  return NavigationActions.navigate({ routeName: "Sensors" });
}

export function navigateAbout() {
  return NavigationActions.navigate({ routeName: "About" });
}

export function navigateFiles() {
  return NavigationActions.navigate({ routeName: "Files" });
}

export function navigateConfigure() {
  return NavigationActions.navigate({ routeName: "Configure" });
}

export function navigatePath(path) {
  return NavigationActions.navigate({ routeName: "Files" });
}

export function navigateName(name) {
    return NavigationActions.navigate({ routeName: name });
}

export function navigateNetwork() {
  return NavigationActions.navigate({ routeName: "Network" });
}

export function navigateBrowser(path) {
  return NavigationActions.navigate({
    routeName: "Browser",
    params: { path: path, replaceSame: true }
  });
}

export function navigateLocalFile(path) {
  return NavigationActions.navigate({
    routeName: "LocalFile",
    params: { path: path }
  });
}

export function navigateOpenFile(path) {
  return NavigationActions.navigate({
    routeName: "DataTable",
    params: { path: path }
  });
}

export function navigateEasyModeWelcome() {
  return NavigationActions.navigate({ routeName: "EasyModeWelcome" });
}

export function navigateLiveData() {
  return NavigationActions.navigate({ routeName: "LiveData" });
}

export function navigateBack() {
    return NavigationActions.back();
}
