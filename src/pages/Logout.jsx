import { useEffect } from 'react';
import { useStore } from 'statium';

import { logout } from '../actions/user.js';

const Logout = () => {
  const { dispatch } = useStore();

  useEffect(() => {
    dispatch(logout);
  }, [dispatch]);

  return null;
};

export default Logout;
