import React from 'react';
import { mount } from 'test/enzyme.js';
import Store from 'statium';

jest.mock('../actions/user.js');

import { register } from '../actions/user.js';

import Register from './Register.jsx';

describe("Register form", () => {
  describe("UI behavior", () => {
    it("should render", () => {
      const tree = mount(<Register />);

      expect(tree.find('Register')).toMatchSnapshot();
    });

    it("should disable submit button by default", () => {
      const tree = mount(<Register />);

      expect(tree.find('button[type="submit"]').prop('disabled')).toBe(true);
    });

    it("should enable submit button when filled in and valid", async () => {
      const tree = mount(<Register />);

      await tree.find('Store').instance().set({
        username: 'foobaroo',
        email: 'foo@bar.baz',
        password: 'foobaroo',
        password2: 'foobaroo',
      });

      tree.update();

      expect(tree.find('Register')).toMatchSnapshot();
      expect(tree.find('button[type="submit"]').prop('disabled')).toBe(false);
    });

    it("should disable submit button when there are server errors", async () => {
      const tree = mount(<Register />);

      await tree.find('Store').instance().set({
        username: 'bazuroo',
        email: 'baz@bar.baz',
        password: 'blergobonz',
        password2: 'blergobonz',
        serverErrors: {
          "email": ["has already been taken"],
          "username": ["has already been taken"],
        },
      });

      tree.update();

      const { errors } = tree.find('Store').instance().store.state;

      // No form errors are expected, all values are valid
      expect(errors).toEqual({
        username: null,
        email: null,
        password: null,
        password2: null,
      });

      // Server errors are displayed as a list above the form
      expect(tree.find('ErrorList')).toMatchSnapshot();

      expect(tree.find('button[type="submit"]').prop('disabled')).toBe(true);
    });
  });

  describe("user interaction", () => {
    beforeEach(() => {
      register.mockClear();
    });

    it("should dispatch register action when form is submitted", async () => {
      const tree = mount(<Register />);

      // We have more than one Store in the tree in this test, need to specify
      // which one to get the instance for. The "tag" prop is ideal for this.
      await tree.find('Store[tag="Register"]').instance().set({
        username: 'frobbe',
        email: 'frobbe@bar.baz',
        password: 'throbbe',
        password2: 'throbbe',
      });

      tree.update();
      
      // The usual option would be to simulate the click event on the submit button.
      // This approach is better since submitting a form can be done by pressing Enter key
      // in a field as well and this way we test that, too.
      tree.find('form').simulate('submit');

      // Give the event handler a chance to fire. We cannot await for a Promise here
      // since it is not returned from the event simulation method. This is a limitation
      // of Enzyme API.
      await sleep(10);

      expect()
    });
  });
});
