import React from 'react';
import { useStore } from 'statium';

import { alertsKey } from '../symbols.js';

// This action is only used internally by the Alert widget
const closeAlert = async ({ state, set }, id) => {
  const alerts = state[alertsKey];

  const idx = alerts.findIndex(alert => alert.id === id);

  if (idx > -1) {
    alerts.splice(idx, 1);
    await set({ [alertsKey]: alerts })
  }
};

export const Alert = props => {
  const { dispatch } = useStore();
  const {
    id,
    type = 'primary',
    dismissible = true,
    text,
    timeout = 5000,
  } = props;

  const cls = `alert alert-${type} ${dismissible ? 'alert-dismissible' : ''}`

  let children = [...React.Children.toArray(props.children), text];

  if (dismissible) {
    const onClick = () => dispatch(closeAlert, id);

    if (timeout) {
      setTimeout(onClick, timeout);
    }

    children = [...children, (
      <button key="close" type="button"
        className="close"
        aria-label="Close"
        onClick={onClick}>
        <span key="x" aria-hidden="true">&times;</span>
      </button>
    )];
  }

  return (
    <div className={cls} role="alert">
      {children}
    </div>
  );
}

export const Alerts = () => {
  const { state: { [alertsKey]: alerts } } = useStore();

  return (
    <>
      { alerts.map(({ id, ...alert }) =>
        <Alert key={id} id={id} {...alert} />)
      }
    </>
  );
};
