import "es6-symbol/implement";

import React from "react";
import { YellowBox, AppRegistry } from "react-native";
import { Provider } from "react-redux";

import * as Services from "./app/services";
import reducer from "./app/reducers";
import { configureStore, runSagas, initializeLogging } from "./app/startup";
import AppContainer from "./app/containers/AppContainer";

initializeLogging();

const store = configureStore(reducer, {});

const sagas = runSagas();

const App = () => (
    <Provider store={store}>
        <AppContainer />
    </Provider>
);

export default App;
export const Sagas = sagas;

console.ignoredYellowBox = ["Remote debugger"];
YellowBox.ignoreWarnings(["Remote debugger", "Require cycle"]);

AppRegistry.registerComponent("FieldKit", () => App);
