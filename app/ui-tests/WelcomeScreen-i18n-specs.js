import React from "react";
import WelcomeScreen from "../containers/WelcomeScreen";
import { mockFunctionHelper } from "../../specs/helpers";

import { shallow, mount, render } from "enzyme";
import i18n from "../internationalization/i18n";
import toJson from "enzyme-to-json";

let store = mockFunctionHelper({});

describe("<WelcomeScreen/>", () => {
  describe("render()", () => {
    test("renders the component", () => {
      i18n.locale = "es-US";
      const wrapper = shallow(<WelcomeScreen store={store} />);
      const component = wrapper.dive();
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
