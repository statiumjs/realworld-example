import React from 'react';
import ViewModel, { Bind } from 'statium';
import { Link } from 'react-router-dom';

import LoadMask from './LoadMask.js';
import ErrorList from './ErrorList';

const defaultState = {
    busy: false,
    errors: {},
    username: '',
    email: '',
    password: '',
    password2: '',
};

const submit = async ({ $get, $set }) => {
    try {
        const [api, username, email, password] =
            $get('api', 'username', 'email', 'password');
        
        const user = await api.User.register(username, email, password);
        
        await $set('user', user);
        
        const history = $get('history');
        history.push('/');
    }
    catch (e) {
        // TODO Handle errors
    }
};

const validate = ({ password, password2, ...state }) => {
    const errors = { ...state.errors };
    
    if (password !== '' && password.length < 3) {
        // This is very arbitrary, just to showcase form validation
        errors.password = 'Invalid password: should be longer than 3 characters!';
    }
    else {
        delete errors.password;
    }
    
    if (password2 !== '' && password2 !== password) {
        errors.password2 = 'Passwords do not match!';
    }
    else {
        delete errors.password2;
    }
    
    return {
        errors,
    };
};

const Register = () => (
    <ViewModel id="Register"
        initialState={defaultState}
        applyState={validate}
        controller={{
            handlers: {
                submit,
            },
        }}>
        
        <Bind controller
            props={["busy", "errors", ["username", true], ["email", true],
                   ["password", true], ["password2", true]]}>
            
            { ({ busy, errors, ...values }, { $dispatch }) => (
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
                                
                                <ErrorList errors={errors} />
                                
                                <form>
                                    <fieldset>
                                        <fieldset className="form-group">
                                            <input type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Username"
                                                value={values.username}
                                                onChange={e => {
                                                    values.setUsername(e.target.value);
                                                }} />
                                        </fieldset>
                                        
                                        <fieldset className="form-group">
                                            <input type="email"
                                                className="form-control form-control-lg"
                                                placeholder="Email"
                                                value={values.email}
                                                onChange={e => {
                                                    values.setEmail(e.target.value);
                                                }} />
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
                                        </fieldset>
                                    </fieldset>
                                    
                                    <button type="button"
                                        className="btn btn-lg btn-primary pull-xs-right"
                                        disabled={busy || Object.keys(errors).length > 0}
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
