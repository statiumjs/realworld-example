import React from 'react';
import Store from 'statium';
import { Navigate, Link } from 'react-router-dom';

import { login } from '../actions/user.js';
import { emailRe, inputCls, haveErrors } from '../misc/form.js';

import LoadMask from '../components/LoadMask.jsx';
import ErrorList from '../components/ErrorList.jsx';

import './Login.css';

const initialState = {
  email: '',
  password: '',
  busy: false,  
  errors: {},
  serverErrors: null,
};

const Login = () => (
  <Store tag="Login" initialState={initialState} controlStateChange={validate}>
  {({ state, set, dispatch }) => {
    if (state.user) {
      return <Navigate replace to="/" />;
    }

    const onSubmit = e => {
      e.preventDefault();
      dispatch(login);
    };

    return (
      <div className="auth-page">
        <LoadMask loading={state.busy} />

        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="/register">
                  Need an account?
                </Link>
              </p>

              <ErrorList errors={state.serverErrors || {}} />

              <form onSubmit={onSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className={inputCls(state.errors.email)}
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
                      placeholder="Password"
                      value={state.password}
                      onChange={e => set({ password: e.target.value, serverErrors: null })} />

                    <div className="invalid-feedback">
                      {state.errors.password}
                    </div>
                  </fieldset>

                  <button type="submit" className="btn btn-lg btn-primary pull-xs-right"
                    disabled={state.busy || !isReady(state)}
                  >
                    Sign In
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }}
  </Store>
);

const validate = ({ email, password }) => ({
  errors: {
    email: email !== '' && !emailRe.test(email)
      ? 'Invalid e-mail address'
      : null,
    password: password !== '' && password.length < 3
      ? 'Invalid password: should be longer than 3 characters'
      : null,
  },
});

const isReady = ({ email, password, ...state }) => !haveErrors(state) && email && password;

export default Login;
