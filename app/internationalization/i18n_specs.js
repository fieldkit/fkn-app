import React from 'react';
import _ from 'lodash';
import renderer from 'react-test-renderer';

import DeviceOptions from '../containers/EasyModeScreen';
import i18n from './i18n';

test('translating', () => {
    const value = renderer.create(
        <Provider store = {store}>
            <DeviceOptions/>
        </Provider>
        ).toJSON();
    expect(value).toMatchSnapshot();
});
