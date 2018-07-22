// __tests__/PinCodeTest.js
import 'react-native'
import React from 'react'
import PinCode from 'dist/src/PinCode'

import renderer from 'react-test-renderer'

it('renders correctly', () => {
    const tree = renderer.create(
        <PinCode />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
