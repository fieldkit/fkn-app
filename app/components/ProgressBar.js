import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import AnimatedBar from "react-native-animated-bar";

export class ProgressBar extends React.Component {
    render() {
        const { progress } = this.props;

        return <View><AnimatedBar progress={progress / 100.0} height={25} borderColor="#ddd" barColor="tomato" borderRadius={5} borderWidth={2} animate={true} /></View>;
    }
};

ProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
};
