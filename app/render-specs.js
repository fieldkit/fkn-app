import "react-native";

import React from "react";
import renderer from "react-test-renderer";

import AndroidApp, { Sagas as AndroidSagas } from "../index";
import IOSApp, { Sagas as IOsSagas } from "../index";

describe("top level rendering", () => {
    it("renders iOS correctly", () => {
        const tree = renderer.create(<IOSApp />);
        IOsSagas.cancel();
    });

    it("renders Android correctly", () => {
        const tree = renderer.create(<AndroidApp />);
        AndroidSagas.cancel();
    });
});
