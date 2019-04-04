import React from "react";
import WelcomeScreen from "../containers/WelcomeScreen";

import { shallow, mount, render } from "enzyme";
import { mockFunctionHelper } from "../../specs/helpers";
import toJson from "enzyme-to-json";

const store = mockFunctionHelper({});

describe("<WelcomeScreen/>", () => {
    describe("render()", () => {
        test("renders the component", () => {
            const wrapper = shallow(<WelcomeScreen store={store} />);
            const component = wrapper.dive();
            expect(toJson(component)).toMatchSnapshot();
        });
    });
});
