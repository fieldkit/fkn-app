import "react-native";

import React from "react";
import TestRenderer from "react-test-renderer";

import { AtlasTemperatureScript } from "./TempSensor";

import { AtlasScript } from "./AtlasScript";

import { AtlasCommands } from "./AtlasCommands";

const atlasCommands = new AtlasCommands();

describe("Atlas Plugin", () => {
    let props = {};

    beforeEach(() => {
        props = {
            timer: {},
            atlasState: {
                values: [],
                commands: atlasCommands.getCommands(25, "1")
            },
            timerStart: jest.fn(),
            timerCancel: jest.fn(),
            atlasCalibrate: jest.fn(),
            atlasReadSensor: jest.fn(),
            onCancel: jest.fn()
        };
    });

    describe("Temperature", () => {
        it("renders", () => {
            const tree = TestRenderer.create(
                <AtlasTemperatureScript {...props} />
            );

            console.log(tree.toJSON());
        });
    });
});
