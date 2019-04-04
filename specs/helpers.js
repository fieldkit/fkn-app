import React from "react";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import thunkMiddleware from "redux-thunk";

import configureStore from "redux-mock-store";

export function mockFunctionHelper(initialState) {
  configure({ adapter: new Adapter() });
  const mockStore = configureStore([thunkMiddleware]);
  const store = mockStore(initialState);
  return store;
}
