import React from 'react';
import Store from 'statium';
import { mount } from 'test/enzyme.js';

import FollowButton from './FollowButton';

// We need to wrap the FollowButton component in a Store to be able to use it.
// No special requirements, just an empty Store will do.
const TestFollowButton = props => (
  <Store tag="test">
    <FollowButton {...props} />
  </Store>
);

describe("FollowButton component", () => {
  describe("rendering", () => {
    it("should render the 'follow' button when not following a user", () => {
      const tree = mount(<TestFollowButton username="foobaroo" following={false} />);

      expect(tree.find('FollowButton')).toMatchSnapshot();
    });

    it("should render the 'unfollow' button when following a user", () => {
      const tree = mount(<TestFollowButton username="foobaroo" following={true} />);

      expect(tree.find('FollowButton')).toMatchSnapshot();
    });

    it("should render the button disabled when disableButton state is true", async () => {
      // FollowButton component uses Statium.useState() hook to store its temporary
      // disabledness flag. Unlike React.useState(), we can wrap the tested component
      // in a Store and simply pass in the desired state to test it upfront, as well as
      // update it later.
      // The FollowButton is a leaf component that never has any children so the state key
      // can be named in any way convenient. If there is a possibility for key name collision,
      // Symbol keys can be used instead of strings to ensure that all state keys are unique.
      const tree = mount(
        <Store tag="disable" initialState={{ disableButton: true }}>
          <TestFollowButton username="foobaroo" following={true} />
        </Store>
      );

      expect(tree.find('button').prop('disabled')).toBe(true);

      // Update the state externally to make sure that the component is rendered correctly.
      // Note that we actually have _two_ Stores in the tree, and instance() method requires
      // only one node to be found. We can use Store tag prop for it.
      // Note that calling set() on a Store instance returns a Promise that is guaranteed
      // to be resolved only when the state is completely updated and child components
      // have finished rendering! We can use this combined with await keyword to write
      // readable tests that are easy to follow and comprehend.
      await tree.find('Store[tag="disable"]').instance().set({ disableButton: false });

      // Setting component state does not update the Enzyme wrapper tree, unfortunately.
      // We need to do this manually to make sure the state is reflected in the tree.
      tree.update();

      expect(tree.find('button').prop('disabled')).toBe(false);
    });
  });

  describe("behavior", () => {
    let follow, unfollow;

    beforeEach(() => {
      follow = jest.fn();
      unfollow = jest.fn();
    });

    it("should dispatch follow action when not following the user and clicking on the button", async () => {
      // Note that we don't have to have an extra store for disableButton state here
      // since we don't intend to manipulate it.
      const tree = mount(
        <TestFollowButton username="foobaroo"
          following={false}
          follow={follow}
          unfollow={unfollow} />
      );

      tree.find('button').simulate('click');

      // Give the action enough time to fire. sleep() global is defined in test/setup.js
      await sleep(10);

      expect(follow).toHaveBeenCalled();
      expect(unfollow).not.toHaveBeenCalled();
      
      const args = follow.mock.calls[0];

      // First argument is Store API: { data, state, set, dispatch }. We don't need to test it.
      expect(args[1]).toBe('foobaroo');
    });

    it("should dispatch unfollow action when following the user and clicking on the button", async () => {
      const tree = mount(
        <TestFollowButton username="foobaroo"
          following={true}
          follow={follow}
          unfollow={unfollow} />
      );

      tree.find('button').simulate('click');

      await sleep(10);

      expect(unfollow).toHaveBeenCalled();
      expect(follow).not.toHaveBeenCalled();

      const args = unfollow.mock.calls[0];

      expect(args[1]).toBe('foobaroo');
    });
  });
});
