import React from "react";
import _ from "lodash";
import renderer from "react-test-renderer";

import DeviceOptions from "../containers/EasyModeScreen";
import WelcomeScreen from "../containers/WelcomeScreen";
import i18n from "./i18n";

test("translating", () => {
  expect("Connect").toMatch(i18n.t("welcome.connect"));
});
