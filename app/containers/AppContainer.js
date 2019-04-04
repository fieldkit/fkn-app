import React from "react";
import { connect } from "react-redux";

import AppWithNavigationState from "../navigators/AppNavigator";

class AppContainer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <AppWithNavigationState />;
    }
}

export default AppContainer;
