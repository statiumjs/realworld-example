import React from 'react';
import Store, { useStore } from 'statium';
import { Navigate, Link } from 'react-router-dom';

import { saveUserSettings } from '../actions/user.js';
import { emailRe, urlRe, inputCls, haveErrors } from '../misc/form.js';

import LoadMask from '../components/LoadMask.jsx';
import ErrorList from '../components/ErrorList.jsx';

const initialState = {
  busy: false,
  password: '',
  password2: '',
  errors: {},
  serverErrors: null,
};

// The props come from existing user object and we use the values to initialize form state
const Settings = () => {
  const { state: { user } } = useStore();

  const username = user?.username;
  const image = user?.image;
  const bio = user?.bio;
  const email = user?.email;

  return (
    <Store tag="Settings" initialState={{
        ...initialState,
        username,
        image: image || '',
        bio: bio || '',
        email,
      }}
      controlStateChange={validate}
    >
    {({ state, set, dispatch }) => {
      if (!state.user) {
        return <Navigate replace to="/login" />;
      }

      const onSubmit = e => {
        e.preventDefault();
        dispatch(saveUserSettings);
      };

      return (
        <div className="settings-page">
          <div className="container page">
            <LoadMask loading={state.busy} />

            <div className="row">
              <div className="col-md-6 offset-md-3 col-xs-12">
                <h1 className="text-xs-center">
                  Your Settings
                </h1>

                { state.serverErrors && <ErrorList errors={state.serverErrors} /> }

                <form onSubmit={onSubmit}>
                  <fieldset>
                    <fieldset className="form-group">
                      <input className={inputCls(state.errors.image)}
                        type="text"
                        placeholder="URL of profile picture"
                        value={state.image}
                        // Resetting server errors on input field change allows us to proceed
                        // after we submitted the form once and got back an error.
                        onChange={e => set({ image: e.target.value, serverErrors: null })} />
                      
                      <div className="invalid-feedback">
                        {state.errors.image}
                      </div>
                    </fieldset>

                    <fieldset className="form-group">
                      <input className={inputCls(state.errors.username)}
                        type="text"
                        placeholder="Username"
                        value={state.username}
                        onChange={e => set({ username: e.target.value, serverErrors: null })} />
                      
                      <div className="invalid-feedback">
                        {state.errors.username}
                      </div>
                    </fieldset>

                    <fieldset className="form-group">
                      <textarea className="form-control form-control-lg"
                        rows="8"
                        placeholder="Short bio about you"
                        value={state.bio}
                        onChange={e => set({ bio: e.target.value, serverErrors: null })} />
                    </fieldset>

                    <fieldset className="form-group">
                      <input className={inputCls(state.errors.email)}
                        type="email"
                        placeholder="Email"
                        value={state.email}
                        onChange={e => set({ email: e.target.value, serverErrors: null })} />
                      
                      <div className="invalid-feedback">
                        {state.errors.email}
                      </div>
                    </fieldset>

                    <fieldset className="form-group">
                      <input className={inputCls(state.errors.password)}
                        type="password"
                        placeholder="New Password"
                        value={state.password}
                        onChange={e => set({ password: e.target.value, serverErrors: null })} />

                      <div className="invalid-feedback">
                        {state.errors.password}
                      </div>
                    </fieldset>

                    <fieldset className="form-group">
                      <input className={inputCls(state.errors.password2)}
                        type="password"
                        placeholder="Confirm New Password"
                        value={state.password2}
                        onChange={e => set({ password2: e.target.value, serverErrors: null })} />

                      <div className="invalid-feedback">
                        {state.errors.password2}
                      </div>
                    </fieldset>

                    <button type="submit" className="btn btn-lg btn-primary pull-xs-right"
                      disabled={state.busy || !isReady(state)}
                    >
                      Update Settings
                    </button>
                  </fieldset>
                </form>

                <hr />

                <Link to="/logout" className="btn btn-outline-danger">
                  Or click here to log out.
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }}
    </Store>
  );
}

// This is very arbitrary, a real application likely needs
// a more sophisticated form validation approach. Note that we don't
// validate bio.
const validate = ({ username, email, image, password, password2 }) => ({
  errors: {
    username: username !== '' && username.length < 3
      ? 'User name should be longer than 3 characters'
      : null,

    email: email !== '' && !emailRe.test(email)
      ? 'E-mail address is invalid'
      : null,
    
    image: image !== '' && !urlRe.test(image)
      ? 'Image URL is invalid'
      : null,

    password: password !== '' && password.length < 3
      ? 'Invalid password: should be longer than 3 characters'
      : null,
    password2: password2 !== '' && password2 !== password
      ? 'Passwords do not match'
      : null,
  },
});

// We don't check for the profile image URL, bio, and passwords to be filled in,
// these fields are optional. If the image URL is present it needs to be valid,
// this is checked in the validate function above.
const isReady = ({ username, email, password, password2, ...state }) =>
  !haveErrors(state) && username && email;

export default Settings;
