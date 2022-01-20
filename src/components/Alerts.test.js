import React from 'react';
import { mount } from 'test/enzyme.js'

import { alertsKey } from '../symbols.js';
import Notifications from './NotificationProvider.jsx';
import { Alerts } from './Alerts.jsx';
import { displayAlert } from '../actions/alerts.js';

const alerts = [{
  id: 0,
  type: 'error',
  text: 'foo bar',
  dismissible: false,
}, {
  id: 1,
  text: 'blerg bonz',
}, {
  id: 2,
  type: 'success',
  text: 'throbbe zong',
}];

describe("Alerts", () => {
  let tree;

  beforeEach(() => {
    tree = mount(
      <Notifications>
        <Alerts />
      </Notifications>
    );
  });

  describe("rendering", () => {
    it("should render empty alert list by default", () => {
      expect(tree.find('Alerts')).toMatchSnapshot();
    });

    it("should render alert widgets correctly", async () => {
      await tree.find('Store[tag="Notifications"]').instance().set({
        [alertsKey]: alerts,
      });

      tree.update();

      expect(tree.find('Alerts')).toMatchSnapshot();
    });
  });

  describe("behavior", () => {
    beforeEach(async () => {
      await tree.find('Store[tag="Notifications"]').instance().dispatch(
        displayAlert,
        {
          type: "success",
          text: "plugh krabbe",
          timeout: 50,
        }
      );

      tree.update();
    });

    it("should display alert when action is dispatched", async () => {
      expect(tree.find('Alert')).toMatchSnapshot();
    });

    it("should close dismissible alert on timeout", async () => {
      // Dismiss timeout is set to 50 ms
      await sleep(100);

      expect(tree.find('Alerts').contains('Alert')).toBe(false);
    });

    it("should close dismissible alert on button click", async () => {
      tree.find('Alert button').simulate('click');

      // Give the handler enough time to fire
      await sleep(10);

      expect(tree.find('Alerts').contains('Alert')).toBe(false);
    });
  });
});