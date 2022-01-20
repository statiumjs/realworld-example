import React from 'react';
import { useStore, useState } from 'statium';

const FollowButton = ({ username, following, follow, unfollow }) => {
  const { dispatch } = useStore();

  // This state value is transient and local, it is only used when we are making
  // a backend request to follow or unfollow a user: the button should be disabled
  // while request is handled. Because of this very limited scope of exposure, it
  // does not make sense to declare this state value in a parent Store explicitly.
  // That said, we still want this component to be easily testable and we can
  // achieve this goal by using Statium useState() hook:
  // the first argument is the default state value (same as React.useState),
  // the second argument is the Store key for this state.
  // We use the key in the unit test to manipulate the component.
  const [disabled, setDisabled] = useState(false, 'disableButton');

  const cls = `btn btn-sm action-btn ${following ? 'btn-secondary' : 'btn-outline-secondary'}`;
  const style = { opacity: disabled ? '0.5' : '1' };

  const onClick = async e => {
    e.preventDefault();

    await setDisabled(true);
    await dispatch(following ? unfollow : follow, username);
    await setDisabled(false);
  }

  return (
    <button className={cls} style={style} disabled={disabled} onClick={onClick}>
      <i className={following ? "ion-minus-round" : "ion-plus-round"} />
      &nbsp;
      {following ? `Unfollow ${username}` : `Follow ${username}`}
    </button>
  );
};

export default FollowButton;