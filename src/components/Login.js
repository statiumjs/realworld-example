import React from 'react';
import ViewModel, { Bind, withBindings } from 'statium';
import { Link, Redirect } from 'react-router-dom';
import get from 'lodash.get';

import './Login.css';

const ErrorList = ({ errors }) => {
    if (!errors) {
        return null;
    }
    
    return (
        <ul className="error-messages">
            {Object.keys(errors).map(err => (
                <li key={err}>
                    {err} {errors[err]}
                </li>
            ))}
        </ul>
    );
};

const initialState = {
    email: '',
    password: '',
    inProgress: false,
    errors: {},
};

const emailRe = /^.+@.+$/;

const validate = ({ email, password, ...state }) => {
    const { errors } = state;
    
    if (email !== '' && !emailRe.test(email)) {
        errors.email = 'Invalid e-mail address';
    }
    else {
        delete errors.email;
    }
    
    if (password !== '' && password.length < 3) {
        errors.password = 'Invalid password';
    }
    else {
        delete errors.password;
    }
    
    return {
        ...state,
        errors,
    };
};

const inputCls = (name, errors) =>
    `form-control form-control-lg ${errors[name] ? 'is-invalid' : 'is-valid'}`;

const login = async ({ $get, $set, $dispatch }, { email, password }) => {
    await $set('inProgress', true);
    
    const api = $get('api');
    
    try {
        const data = await api.User.login(email, password);
        
        const user = get(data, 'user', null);
        
        // TODO Revert to this after protected key setting bug is fixed:
        // https://github.com/riptano/statium/issues/8
        $dispatch('setUser', user);
//         $set({ user });
    }
    catch (e) {
        $set({
            inProgress: false,
            errors: {
                'Invalid e-mail or password': '',
            },
        });
    }
};

const haveFieldErrors = errors => {
    const copy = { ...errors };
    delete copy["Invalid e-mail or password"];
    
    return Object.keys(copy).length > 0;
};

const LoginForm = () => (
    <Bind controller
        props={[['email', true], ['password', true], 'errors', 'inProgress']}>
        { ({ email, setEmail, password, setPassword, errors, inProgress }, { $dispatch }) => (
            <div className="col-md-6 offset-md-3 col-xs-12">
                <h1 className="text-xs-center">
                    Sign In
                </h1>
                <p className="text-xs-center">
                    <Link to="/register">
                        Need an account?
                    </Link>
                </p>
            
                <ErrorList errors={errors} />
            
                <form onSubmit={e => {
                        e.preventDefault();
                    
                        $dispatch('login', { email, password });
                    }}>
                    <fieldset>
                        <fieldset className="form-group">
                            <input
                                className={inputCls('email', errors)}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)} />
                            
                            <div className="invalid-feedback">
                                {errors.email}
                            </div>
                        </fieldset>
                    
                        <fieldset className="form-group">
                            <input className={inputCls('password', errors)}
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)} />
                            
                            <div className="invalid-feedback">
                                {errors.password}
                            </div>
                        </fieldset>
                    
                        <button
                            className="btn btn-lg btn-primary pull-xs-right"
                            type="submit"
                            disabled={inProgress || haveFieldErrors(errors)}>
                            Sign In
                        </button>
                    </fieldset>
                </form>
            </div>
        )}
    </Bind>
);

const Login = ({ user }) => {
    if (user) {
        return <Redirect to="/" />;
    }
    
    return (
        <ViewModel id="Login"
            initialState={initialState}
            applyState={validate}
            controller={{
                handlers: {
                    login,
                },
            }}>
            <div className="auth-page">
                <div className="container page">
                    <div className="row">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </ViewModel>
    );
};

export default withBindings('user')(Login);
