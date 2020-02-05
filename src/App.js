import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ViewModel, { Bind } from 'statium';

import getApi from './api.js';

import LoadMask from './components/LoadMask.js';
import Header from './components/Header.js';
import Home from './components/Home/index.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Article from './components/Article/index.js';
import Editor from './components/Editor/index.js';
import Profile from './components/Profile.js';
import Settings from './components/Settings.js';

const defaultState = {
    user: null,
    api: getApi(),
    appReady: false,
};

const App = ({ history }) => (
    <ViewModel id="App"
        data={{ history }}
        initialState={defaultState}
        
        protectedKeys="user"
        
        controller={{
            initialize,
            handlers: {
                setUser,
            },
        }}>
        
        <Bind props="appReady">
            { ({ appReady }) => {
                if (!appReady) {
                    return (
                        <div className="container">
                            <LoadMask loading={true} />
                        </div>
                    );
                }
                
                return (
                    <>
                        <Header />

                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                            <Route path="/article/:slug" component={Article} />
                            <Route path="/editor/:slug" component={Editor} />
                            <Route path="/editor" component={Editor} />
                            <Route path="/settings" component={Settings} />
                            <Route path="/@:username/favorites"
                                render={routeProps => (
                                    <Profile {...routeProps} tab="favorites" />
                                )} />
                            <Route path="/@:username" component={Profile} />
                            <Route path="/feed"
                                render={routeProps => (
                                    <Home {...routeProps} tab="feed" />
                                )} />
                            <Route exact path="/" component={Home} />
                        </Switch>
                    </>
                );
            }}
        </Bind>
    </ViewModel>
);

export default App;

const initialize = async ({ $set, $dispatch }) => {
    const token = window.localStorage.getItem('jwtToken');
    
    if (token) {
        try {
            const api = getApi(token);
            const user = await api.User.current();
            
            await $set({ api });
            await $dispatch('setUser', user);
            
            // TODO Revert to this after protected key setting bug is fixed:
            // https://github.com/riptano/statium/issues/8
//             await $set({
//                 api,
//                 user,
//             });
        }
        catch (e) {
            // Token expired, etc. Default API is tokenless, so no need to set it again.
            await $set({ user: null });
        }
    }
    
    // User was not logged in previously, or token has expired.
    // Default state represents non-logged in experience so we are ready at this point.
    await $set('appReady', true);
};

const setUser = async ({ $set }, user) => {
    user = user || null;
    
    await $set({ user });
    
    if (user && user.token) {
        window.localStorage.setItem('jwtToken', user.token);
    }
    else {
        window.localStorage.removeItem('jwtToken');
    }
};
