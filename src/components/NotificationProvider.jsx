import React from 'react';
import Store from 'statium';

import Modal from './Modal.jsx';

import { modalKey, alertsKey } from '../symbols.js';

const initialState = {
  [modalKey]: null,
  [alertsKey]: [],
};

// This Store holds the state for both types of global notifications:
// alerts and modals. We support multiple alerts displayed simultaneously,
// and only one modal at a time. Modal overlays other components on the page,
// and so it makes sense to render it at the top of the component tree;
// alerts need to be rendered within the tree to satisfy the design requirements
// so we export a separate Alerts component and render it below the page header
// in the App component.
const Notifications = ({ children }) => (
  <Store tag="Notifications" initialState={initialState}>
  { ({ state: { [modalKey]: modal } }) => (
    <>
      <Modal show={!!modal} {...modal || {}} />
      {children}
    </>
  )}
  </Store>
);

export default Notifications;
