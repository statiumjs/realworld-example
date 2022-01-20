import React from 'react';
import { mount } from 'test/enzyme.js';

import App from './App';

describe("Application", () => {
  it("renders", () => {
    const tree = mount(<App />);

    expect(tree.find('App')).toMatchSnapshot();
  });
});
