import React from "react";
import WelcomeScreen from "../containers/WelcomeScreen";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount, render } from "enzyme";
import thunkMiddleware from "redux-thunk";
import i18n from "../internationalization/i18n";

configure({ adapter: new Adapter() });

import toJson from "enzyme-to-json";
import configureStore from "redux-mock-store";

const mockStore = configureStore([thunkMiddleware]);
const initialState = {};
const store = mockStore(initialState);

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
