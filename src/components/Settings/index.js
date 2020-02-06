import React from 'react';
import ViewModel, { Bind } from 'statium';
import { Redirect } from 'react-router-dom';

import LoadMask from '../LoadMask.js';

import { initialize, submit, logout, validate } from './handlers.js';

const defaultState = {
    busy: true,
    image: '',
    username: '',
    bio: '',
    email: '',
    password: '',
    password2: '',
    errors: {},
};

const Settings = () => (
    <ViewModel id="Settings"
        initialState={defaultState}
        applyState={validate}
        controller={{
            initialize,
            handlers: {
                submit,
                logout,
            },
        }}>
        <Bind props={["user", "busy"]} controller>
            { ({ user, busy }, { $dispatch }) => (
                <>
                    { !user && <Redirect to="/login" /> }
                
                    <div className="settings-page">
                        <div className="container page">
                            <LoadMask loading={busy} />
                        
                            <div className="row">
                                <div className="col-md-6 offset-md-3 col-xs-12">
                                    <h1 className="text-xs-center">
                                        Your Settings
                                    </h1>
                                
                                    <SettingsForm />
                                
                                    <hr />
                                
                                    <button className="btn btn-outline-danger"
                                        onClick={e => {
                                            e.preventDefault();
                                        
                                            $dispatch('logout');
                                        }}>
                                    
                                        Or click here to log out.
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Bind>
    </ViewModel>
);

export default Settings;

const SettingsForm = () => (
    <Bind controller
        props={['busy', ['image', true], ['username', true], ['email', true],
               ['bio', true], ['password', true], ['password2', true], 'errors']}>
        { ({ busy, errors, ...props }, { $dispatch }) => (
            <form>
                <fieldset>
                    <fieldset className="form-group">
                        <input className="form-control form-control-lg"
                            type="text"
                            placeholder="URL of profile picture"
                            value={props.image}
                            onChange={e => { props.setImage(e.target.value); }} />
                    </fieldset>
                    
                    <fieldset className="form-group">
                        <input className="form-control form-control-lg"
                            type="text"
                            placeholder="Username"
                            value={props.username}
                            onChange={e => { props.setUsername(e.target.value); }} />
                    </fieldset>
                    
                    <fieldset className="form-group">
                        <textarea className="form-control form-control-lg"
                            rows="8"
                            placeholder="Short bio about you"
                            value={props.bio}
                            onChange={e => { props.setBio(e.target.value); }} />
                    </fieldset>
                    
                    <fieldset className="form-group">
                        <input className="form-control form-control-lg"
                            type="email"
                            placeholder="Email"
                            value={props.email}
                            onChange={e => { props.setEmail(e.target.value); }} />
                    </fieldset>
                    
                    <fieldset className="form-group">
                        <input className={"form-control form-control-lg" +
                                          (errors.password ? " is-invalid" : "")}
                            type="password"
                            placeholder="New Password"
                            value={props.password}
                            onChange={e => { props.setPassword(e.target.value); }} />
                        
                        <div className="invalid-feedback">
                            {errors.password}
                        </div>
                    </fieldset>
                    
                    <fieldset className="form-group">
                        <input className={"form-control form-control-lg" +
                                          (errors.password2 ? " is-invalid" : "")}
                            type="password"
                            placeholder="Confirm New Password"
                            value={props.password2}
                            onChange={e => { props.setPassword2(e.target.value); }} />
                        
                        <div className="invalid-feedback">
                            {errors.password2}
                        </div>
                    </fieldset>
                    
                    <button className="btn btn-lg btn-primary pull-xs-right"
                        type="button"
                        disabled={busy || Object.keys(errors).length > 0}
                        onClick={e => {
                            e.preventDefault();
                            $dispatch('submit');
                        }}>
                        
                        Update Settings
                    </button>
                </fieldset>
            </form>
        )}
    </Bind>
);
