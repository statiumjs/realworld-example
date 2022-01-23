jest.mock('../api.js');

import {
  getUser,
  setUser,
  login,
  logout,
  register,
  saveUserSettings
} from "./user.js";

import { displayAlert } from "./alerts.js";

import API from '../api.js';

const validUser = {
  username: 'foobaroo',
  email: 'foo@bar.baz',
  bio: null,
  image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
  token: "foo",
}

describe("user actions", () => {
  // We mock the full Store API here and pass it to every action
  // just for consistency.
  let navigate, data, state, set, dispatch;

  beforeEach(() => {
    navigate = jest.fn();

    data = { navigate };

    set = jest.fn();
    dispatch = jest.fn();

    // Cannot spy on window.localStorage, it is a Proxy.
    // See https://github.com/jasmine/jasmine/issues/299
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getUser", () => {
    it("returns null user if there is no token", async () => {
      window.localStorage.getItem.mockImplementation(() => null);

      const user = await getUser();

      expect(user).toBe(null);
    });

    it("validates token if it exists, and returns the user", async () => {
      window.localStorage.getItem.mockImplementation(() => 'foo');
      API.User.current.mockImplementation(() => validUser);

      const user = await getUser();

      expect(user).toEqual(validUser);
      expect(window.localStorage.getItem).toHaveBeenCalledWith('jwtToken');
      expect(API.User.current).toHaveBeenCalled();
    });

    it("returns null user if token is invalid", async () => {
      window.localStorage.getItem.mockImplementation(() => 'foo');
      API.User.current.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const user = await getUser();

      expect(user).toBe(null);
      expect(window.localStorage.getItem).toHaveBeenCalledWith('jwtToken');
      expect(API.User.current).toHaveBeenCalled();
    });
  });

  describe("setUser", () => {
    it("saves the token to localStorage if user is valid", async () => {
      await setUser({ set }, validUser);

      expect(set).toHaveBeenCalledWith({ user: validUser });
      expect(window.localStorage.setItem).toHaveBeenCalledWith('jwtToken', validUser.token);
      expect(window.localStorage.removeItem).not.toHaveBeenCalled();
    });

    it("removes the token from localStorage if user is invalid", async () => {
      await setUser({ set }, null);

      expect(set).toHaveBeenCalledWith({ user: null });
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('jwtToken');
    });
  });

  describe("login", () => {
    beforeEach(() => {
      state = {
        user: null,
        email: validUser.email,
        password: 'foobaroo',
      };
    });

    it("should dispatch setUser action if login was successful", async () => {
      API.User.login.mockImplementation(() => validUser);

      await login({ data, state, set, dispatch });

      expect(API.User.login).toHaveBeenCalledWith(state.email, state.password);
      expect(set).toHaveBeenCalledWith({ busy: true });
      expect(dispatch).toHaveBeenCalledWith(setUser, validUser);
    });

    it("should not dispatch setUser if login failed", async () => {
      const error = new Error(403);
      error.response = {
        errors: {
          'email or password': ["is invalid"]
        }
      };

      API.User.login.mockImplementation(() => {
        throw error;
      });

      await login({ data, state, set, dispatch });

      expect(API.User.login).toHaveBeenCalledWith(state.email, state.password);
      expect(set).toHaveBeenCalledTimes(2);

      // Yes, toHaveBeenNthCalledWith is 1-based
      expect(set).toHaveBeenNthCalledWith(1, { busy: true });
      expect(set).toHaveBeenNthCalledWith(2, {
        busy: false,
        serverErrors: error.response.errors,
      });

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should reset user and navigate to /login", async () => {
      await logout({ data, state, set, dispatch });

      expect(dispatch).toHaveBeenCalledWith(setUser, null);
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("register", () => {
    beforeEach(() => {
      state = {
        username: 'foobaroo',
        email: 'foo@bar.baz',
        password: 'foobaroo123',
        password2: 'foobaroo123',
      }
    });

    it("should dispatch setUser and navigate to / if registration is successful", async () => {
      API.User.register.mockImplementation(() => validUser);

      await register({ data, state, set, dispatch });

      expect(API.User.register).toHaveBeenCalledWith(
        state.username,
        state.email,
        state.password,
      );

      expect(set).toHaveBeenCalledTimes(2);
      expect(set).toHaveBeenNthCalledWith(1, { busy: true });
      expect(set).toHaveBeenNthCalledWith(2, { busy: false });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, setUser, validUser);
      expect(dispatch).toHaveBeenNthCalledWith(2, displayAlert, {
        type: "success",
        text: `Successfully created user ${state.username}!`,
      });

      expect(navigate).toHaveBeenCalledWith("/");
    });

    it("should not dispatch setUser if registration failed", async () => {
      const error = new Error(422);
      error.response = {
        errors: {
          email: ["has already been taken"],
          username: ["has already been taken"],
        }
      }

      API.User.register.mockImplementation(() => {
        throw error;
      });

      await register({ data, state, set, dispatch });

      expect(API.User.register).toHaveBeenCalledWith(
        state.username,
        state.email,
        state.password,
      );

      expect(set).toHaveBeenCalledTimes(2);
      expect(set).toHaveBeenNthCalledWith(1, { busy: true });
      expect(set).toHaveBeenNthCalledWith(2, {
        busy: false,
        serverErrors: error.response.errors,
      });

      expect(dispatch).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe("saveUserSettings", () => {
    beforeEach(() => {
      state = {
        ...validUser,
        password: 'foobaroo123',
        password2: 'foobaroo123',
      };
    });

    it("should dispatch setUser and display a notification on success", async () => {
      API.User.save.mockImplementation(() => validUser);

      await saveUserSettings({ data, state, set, dispatch });

      expect(API.User.save).toHaveBeenCalledWith({
        image: state.image,
        username: state.username,
        bio: state.bio,
        email: state.email,
        password: state.password,
      });

      expect(set).toHaveBeenCalledTimes(2);
      expect(set).toHaveBeenNthCalledWith(1, { busy: true });
      expect(set).toHaveBeenNthCalledWith(2, { busy: false });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, setUser, validUser);
      expect(dispatch).toHaveBeenNthCalledWith(2, displayAlert, {
        type: "success",
        text: "Settings were saved successfully!",
      });
    });

    it("should not dispatch setUser and display an alert on error", async () => {
      // The hosted demo API does not really conform to the rest of the API spec.
      // This response was taken from actual failed API call.
      API.User.save.mockImplementation(() => {
        throw new Error("Unique constraint failed on the fields: (`username`)");
      });

      await saveUserSettings({ data, state, set, dispatch });

      expect(API.User.save).toHaveBeenCalledWith({
        image: state.image,
        username: state.username,
        bio: state.bio,
        email: state.email,
        password: state.password,
      });

      expect(set).toHaveBeenCalledTimes(2);
      expect(set).toHaveBeenNthCalledWith(1, { busy: true });
      expect(set).toHaveBeenNthCalledWith(2, {
        busy: false,
        serverErrors: {
          error: "Unspecified server error: Error: Unique constraint failed on the fields: (`username`)",
        },
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenNthCalledWith(1, displayAlert, {
        type: "danger",
        text: `There were errors while trying to save settings...`,
      })
    });
  });
});