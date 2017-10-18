import 'react-native';

import React from 'react';
import renderer from 'react-test-renderer';

import AndroidApp from '../index.android.js';
import IOSApp from '../index.ios.js';


it('renders iOS correctly', () => {
    const tree = renderer.create(<IOSApp />);
});

it('renders Android correctly', () => {
    const tree = renderer.create(<AndroidApp />);
});
