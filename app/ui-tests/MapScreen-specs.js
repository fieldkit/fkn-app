import React from "react";
import MapScreen from "../containers/MapScreen";
import { mockFunctionHelper } from "../../specs/helpers";

import { shallow, mount, render } from "enzyme";
import i18n from "../internationalization/i18n";
import toJson from "enzyme-to-json";
import * as Types from "../actions/index";

let store = mockFunctionHelper({
  giveLocation: {
    phone: { type: "PHONE_LOC", lat: 34.0314141, long: -118.2663902 },
    sensors: [[-119, 36], [-120, 37], [-118, 34]]
  }
});
describe("<MapScreen/>", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<MapScreen store={store} />);
      const component = wrapper.dive();
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
