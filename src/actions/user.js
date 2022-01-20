import getApi from '../api.js';
import { displayAlert } from './alerts.js';

export const getUser = async () => {
  const token = window.localStorage.getItem('jwtToken');
  let user = null;

  if (token) {
    try {
      const api = getApi(token);
      user = await api.User.current();
    }
    catch (e) {
      // Token expired, etc. Default API is tokenless, so no need to set it again.
    }
  }

  return user;
};

export const setUser = async ({ set }, user) => {
  const token = user?.token;

  // This will return non-authenticated API if token is undefined
  const api = getApi(token);
  
  await set({ api, user });

  if (token) {
    window.localStorage.setItem('jwtToken', token);
  }
  else {
    window.localStorage.removeItem('jwtToken');
  }
};

export const login = async ({ state, set, dispatch }) => {
  await set({ busy: true });

  const { api, email, password } = state;

  try {
    const user = await api.User.login(email, password);

    // We don't reset busy flag after dispatching setUser
    // because the Login page component that dispatches this
    // action will navigate to / if state.user is defined.
    // At that point the Login component will be unmounted
    // and trying to update its store will throw an error.
    // We navigate in the Login component instead of here
    // because we want the redirect to happen upon Login
    // rendering if the user is already logged in, before
    // this action has a chance to be dispatched.
    await dispatch(setUser, user);
  }
  catch (e) {
    await set({
      busy: false,
      serverErrors: e.response?.errors ?? {
        'Login failed': ['Invalid e-mail or password'],
      },
    });
  }
};

// Reset the user object upstream. This will clean up the JWT token as well.
export const logout = async ({ data, dispatch }) => {
  await dispatch(setUser, null);

  data.navigate('/login');
};

export const register = async ({ data, state, set, dispatch }) => {
  const { api, username, email, password } = state;

  try {
    // Prevent user interaction while the API call is being made
    await set({ busy: true });

    const user = await api.User.register(username, email, password);

    // We get here only after the new user record has been created on the server
    await dispatch(setUser, user);
    await set({ busy: false });

    await dispatch(displayAlert, {
      type: "success",
      text: `Successfully created user ${username}!`,
    })

    data.navigate('/');
  }
  catch (e) {
    await set({
      serverErrors: e?.response?.errors ?? { error: `Unspecified server error: ${e}` },
      busy: false,
    });
  }
};

export const saveUserSettings = async ({ state, set, dispatch }) => {
  const { api, image, username, bio, email, password } = state;

  await set({ busy: true });

  try {
    const user = await api.User.save({
      image,
      username,
      bio,
      email,
      password,
    });

    // Update the user object upstream
    await dispatch(setUser, user);

    await set({ busy: false });

    await dispatch(displayAlert, {
      type: "success",
      text: `Settings were saved successfully!`,
    })
  }
  catch (e) {
    await set({
      serverErrors: e?.response?.errors ?? { error: `Unspecified server error: ${e}` },
      busy: false,
    });

    await dispatch(displayAlert, {
      type: "danger",
      text: `There were errors while trying to save settings...`,
    });
  }
};
