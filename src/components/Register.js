import React from 'react';
import ViewModel, { Bind } from 'statium';
import { Link } from 'react-router-dom';

import LoadMask from './LoadMask.js';

const defaultState = {
    busy: false,
    errors: {},
    username: '',
    email: '',
    password: '',
    password2: '',
};

const Register = () => (
    <ViewModel id="Register"
        initialState={defaultState}
        applyState={validate}
        formulas={{
            isValid,
        }}
        controller={{
            handlers: {
                submit,
            },
        }}>
        
        <Bind controller
            props={["busy", "errors", ["username", true], ["email", true],
                   ["password", true], ["password2", true], "isValid"]}>
            
            { ({ busy, errors, isValid, ...values }, { $dispatch }) => (
                <div className="auth-page">
                    <LoadMask loading={busy} />
                    
                    <div className="container page">
                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">
                                    Sign Up
                                </h1>
                                
                                <p className="text-xs-center">
                                    <Link to="/login">
                                        Have an account?
                                    </Link>
                                </p>
                                
                                <form>
                                    <fieldset>
                                        <fieldset className="form-group">
                                            <input type="text"
                                                className={"form-control form-control-lg" +
                                                          (errors.username ? " is-invalid" : "")}
                                                placeholder="Username"
                                                value={values.username}
                                                onChange={e => {
                                                    values.setUsername(e.target.value);
                                                }} />
                                            <div className="invalid-feedback">
                                                {errors.username || ''}
                                            </div>
                                        </fieldset>
                                        
                                        <fieldset className="form-group">
                                            <input type="email"
                                                className={"form-control form-control-lg" +
                                                           (errors.email ? " is-invalid" : "")}
                                                placeholder="Email"
                                                value={values.email}
                                                onChange={e => {
                                                    values.setEmail(e.target.value);
                                                }} />
                                            <div className="invalid-feedback">
                                                {errors.email || ''}
                                            </div>
                                        </fieldset>
                                        
                                        <fieldset className="form-group">
                                            <input type="password"
                                                className={"form-control form-control-lg" +
                                                           (errors.password ? " is-invalid" : "")}
                                                placeholder="Password"
                                                value={values.password}
                                                onChange={e => {
                                                    values.setPassword(e.target.value);
                                                }} />
                                            <div className="invalid-feedback">
                                                {errors.password || ''}
                                            </div>
                                        </fieldset>
                                        
                                        <fieldset className="form-group">
                                            <input type="password"
                                                className={"form-control form-control-lg" +
                                                           (errors.password2 ? " is-invalid" : "")}
                                                placeholder="Confirm password"
                                                value={values.password2}
                                                onChange={e => {
                                                    values.setPassword2(e.target.value);
                                                }} />
                                            <div className="invalid-feedback">
                                                {errors.password2 || ''}
                                            </div>
                                        </fieldset>
                                    </fieldset>
                                    
                                    <button type="button"
                                        className="btn btn-lg btn-primary pull-xs-right"
                                        disabled={busy || !isValid}
                                        onClick={e => {
                                            e.preventDefault();
                                            $dispatch('submit');
                                        }}>
                                        
                                        Sign up
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Bind>
    </ViewModel>
);

export default Register;

const submit = async ({ $get, $set }) => {
    const [api, username, email, password] =
        $get('api', 'username', 'email', 'password');
    
    try {
        await $set('busy', true);

        const user = await api.User.register(username, email, password);
    
        await $set({
            user,
            busy: false,
        });
        
        const history = $get('history');
        history.push('/');
    }
    catch (e) {
        let errors = e?.response?.data?.errors;
        
        if (!errors) {
            errors = { username: "Unspecified server error: " + e.toString() };
        }

        await $set({
            errors,
            busy: false,
        });
    }
};

const validate = ({ password, password2, ...state }) => ({
    errors: {
        // Additive here to keep errors returned from the back end
        ...state.errors,
        
        // This is very arbitrary, just to showcase form validation
        password: password !== '' && password.length < 3
            ? 'Invalid password: should be longer than 3 characters!'
            : null,
        password2: password2 !== '' && password2 !== password
            ? 'Passwords do not match!'
            : null,
    },
});

// Our form is valid when there are no errors *and* it is filled in.
const isValid = $get => {
    const errors = $get('errors');

    for (const error of Object.values(errors)) {
        if (error) {
            return false;
        }
    }

    const [username, email, password, password2] =
        $get('username', 'email', 'password', 'password2');

    if (username && email && password && password2) {
        return true;
    }

    return false;
};
