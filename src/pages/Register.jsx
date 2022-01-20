import React from 'react';
import Store from 'statium';
import { Link } from 'react-router-dom';

import { register } from '../actions/user.js';
import { emailRe, inputCls, haveErrors } from '../misc/form.js';

import ErrorList from '../components/ErrorList.jsx';
import LoadMask from '../components/LoadMask.jsx';

const initialState = {
  busy: false,
  errors: {},
  serverErrors: null,
  username: '',
  email: '',
  password: '',
  password2: '',
};

const Register = () => (
  <Store tag="Register" initialState={initialState} controlStateChange={validate}>
  {({ state, set, dispatch }) => {
    const onSubmit = e => {
      e.preventDefault();
      dispatch(register);
    };

    return (
      <div className="auth-page">
        <LoadMask loading={state.busy} />

        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>

              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>

              <ErrorList errors={state.serverErrors || {}} />

              <form onSubmit={onSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input type="text"
                      className={inputCls(state.errors.username)}
                      placeholder="Username"
                      value={state.username}
                      // Resetting server errors on input field change allows us to proceed
                      // after we submitted the form once and got back an error.
                      onChange={e => set({ username: e.target.value, serverErrors: null })} />
                    
                    <div className="invalid-feedback">
                      {state.errors.username}
                    </div>
                  </fieldset>

                  <fieldset className="form-group">
                    <input type="email"
                      className={inputCls(state.errors.email)}
                      placeholder="Email"
                      value={state.email}
                      onChange={e => set({ email: e.target.value, serverErrors: null })} />
                    
                    <div className="invalid-feedback">
                      {state.errors.email}
                    </div>
                  </fieldset>

                  <fieldset className="form-group">
                    <input type="password"
                      className={inputCls(state.errors.password)}
                      placeholder="Password"
                      value={state.password}
                      onChange={e => set({ password: e.target.value, serverErrors: null })} />
                    
                    <div className="invalid-feedback">
                      {state.errors.password}
                    </div>
                  </fieldset>

                  <fieldset className="form-group">
                    <input type="password"
                      className={inputCls(state.errors.password2)}
                      placeholder="Confirm password"
                      value={state.password2}
                      onChange={e => set({ password2: e.target.value, serverErrors: null })} />
                    
                    <div className="invalid-feedback">
                      {state.errors.password2}
                    </div>
                  </fieldset>
                </fieldset>

                <button type="submit" className="btn btn-lg btn-primary pull-xs-right"
                  disabled={state.busy || !isReady(state)}>
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }}
  </Store>
);

export default Register;

// This is very arbitrary, a real application likely needs
// a more sophisticated form validation approach
const validate = ({ username, email, password, password2 }) => ({
  errors: {
    username: username !== '' && username.length < 3
      ? 'User name should be longer than 3 characters'
      : null,

    email: email !== '' && !emailRe.test(email)
      ? 'E-mail address is invalid'
      : null,

    password: password !== '' && password.length < 3
      ? 'Invalid password: should be longer than 3 characters'
      : null,
    password2: password2 !== '' && password2 !== password
      ? 'Passwords do not match'
      : null,
  },
});

const isReady = ({ username, email, password, password2, ...state }) =>
  !haveErrors(state) && username && email && password && password2;
