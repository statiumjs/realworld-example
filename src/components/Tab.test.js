import React from 'react';
import Store from 'statium';
import { mount } from 'test/enzyme.js';

import Tab from './Tab.jsx';

// We need a Store to dispatch actions. Nothing special needed, just an empty Store.
const TestTab = props => (
  <Store tag="test">
    <Tab {...props} />
  </Store>
);

describe("Tab widget", () => {
  it("should render with inactive cls when currentTab !== id", () => {
    const tree = mount(<TestTab id="foo" name="Foo tab" to="/foo" currentTab="bar" />);

    expect(tree.find('Tab')).toMatchSnapshot();
    expect(tree.find('Link').hasClass('active')).toBe(false);
  });

  it("should render with active cls when currentTab === id", () => {
    const tree = mount(<TestTab id="bar" name="Bar tab :)" to="/bar" currentTab="bar" />);

    expect(tree.find('Tab')).toMatchSnapshot();
    expect(tree.find('Link').hasClass('active')).toBe(true);
  });

  it("should dispatch the passed setTab function on click", async () => {
    const spy = jest.fn();

    const tree = mount(<TestTab id="baz" name="Baz tab" to="/baz" currentTab="bar" setTab={spy} />);

    tree.find('Link').simulate('click');

    // Give the action enough time to fire
    await sleep(10);

    expect(spy).toHaveBeenCalled();

    const args = spy.mock.calls[0];

    // First argument is Store API: { data, state, set, dispatch }. We don't need to test it.
    expect(args[1]).toBe("/baz");
  });
});
