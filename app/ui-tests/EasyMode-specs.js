import React from "react";
import DeviceOptions from "../containers/EasyModeScreen";
import { mockFunctionHelper } from "../../specs/helpers";

import { shallow, mount, render } from "enzyme";
import toJson from "enzyme-to-json";
import * as Types from "../actions/index";

let store = mockFunctionHelper({
    busy: false,
    devices: {
        192.168.2.1: {
            address: {
                host: "",
                key: "",
                port: 54321,
                valid: true
            },
            capabilities: {
                deviceId: [0,4,163,11,0,35,48,141],
                modules: [{name: "FkNat"}]
            }
        }
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
