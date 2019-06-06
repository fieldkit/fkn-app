import React from "react";
import EditDeviceName from "../containers/EditDeviceNameScreen";
import { mockFunctionHelper } from "../../specs/helpers";

import { shallow, mount, render } from "enzyme";
import toJson from "enzyme-to-json";
import * as Types from "../actions/index";

let store = mockFunctionHelper({
    route: {
        key: "id-1559758294807-1",
        params: {
            address: {
                host: "192.168.2.1",
                port: 54321,
                key: "192.168.2.1",
                valid: true
            },
            deviceId: "0004a30b0023308d"
        }
    },
    deviceId: "0004a30b0023308d",
    address: {
        host: "192.168.2.1",
        key: "192.168.2.1",
        port: 54321,
        valid: true
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
