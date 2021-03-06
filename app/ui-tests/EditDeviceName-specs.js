import React from "react";
import EditDeviceName from "../containers/EditDeviceNameScreen";
import { mockFunctionHelper } from "../../specs/helpers";

import { shallow, mount, render } from "enzyme";
import toJson from "enzyme-to-json";
import * as Types from "../actions/index";

let store = mockFunctionHelper({
    nav: {
        index: 1,
        routes: [
            {
                key: "Init-id-1560200089303-0",
                routeName: "EasyModeWelcome",
                type: undefined
            },
            {
                key: "id-1560200089303-1",
                params: {
                    address: {
                        host: "192.168.2.1",
                        key: "192.168.2.1",
                        port: 54321,
                        valid: true
                    },
                    deviceId: "0004a30b0023308d"
                },
                routeName: "EditDeviceName"
            }
        ]
    }
});

describe("<EditDeviceName/>", () => {
    describe("render()", () => {
        test("renders the component", () => {
            const wrapper = shallow(<EditDeviceName store={store} />);
            const component = wrapper.dive();
            expect(toJson(component)).toMatchSnapshot();
        });
    });
});
