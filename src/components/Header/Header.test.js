import React from 'react';
import Store from 'statium';
import { mount } from 'test/enzyme.js';

import Header from './Header.jsx';

describe("Header component", () => {
  it("should render when logged out", () => {
    const tree = mount(
      <Store initialState={{ user: null }}>
        <Header />
      </Store>
    );

    expect(tree.find('Header')).toMatchSnapshot();
  });

  it("should render when logged in", () => {
    const user = {
      username: 'foobaroo',
      image: 'https://foo.bar/baz.png',
    };

    const tree = mount(
      <Store initialState={{ user }}>
        <Header />
      </Store>
    );

    expect(tree.find('Header')).toMatchSnapshot();
  });
});
