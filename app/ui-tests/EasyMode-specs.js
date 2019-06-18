import React from "react";
import { DeviceOptions } from "../containers/EasyModeScreen";
import { mockFunctionHelper } from "../../specs/helpers";

import { shallow, mount, render } from "enzyme";
import toJson from "enzyme-to-json";
import * as Types from "../actions/index";

let store = mockFunctionHelper({
    auth: { isLoggedIn: false },
    progress: {
        task: {
            done: true
        }
    },
    networkConfiguration: {
        internet: {
            info: { effectiveType: "unknown", type: "wifi" },
            online: true,
            timestamp: "Mon Jun 10 2019 13:40:41 GMT-0700 (Pacific Daylight Time)",
            type: "INTERNET_ONLINE"
        },
        network: {
            deviceAp: false,
            ssid: "FK-AASjCwAjMI0"
        }
    },
    devices: {
        "192.168.2.1": {
            address: {
                host: "",
                key: "",
                port: 54321,
                valid: true
            },
            capabilities: {
                deviceId: [0, 4, 163, 11, 0, 35, 48, 141],
                modules: [{ name: "FkNat" }]
            }
        }
    },
    planning: {
        plans: {
            download: [],
            upload: []
        }
    }
});

describe.skip("<DeviceOptions/>", () => {
    describe("render()", () => {
        test("renders the component", () => {
            const wrapper = shallow(<DeviceOptions store={store} />);
            const component = wrapper.dive();
            expect(toJson(component)).toMatchSnapshot();
        });
    });
});
