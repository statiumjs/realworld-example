import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ViewModel from 'statium';

import App from './App.js';

import './index.css';

const Index = () => (
    <ViewModel id="index" data={{ appName: 'Conduit' }}>
        <BrowserRouter>
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        </BrowserRouter>
    </ViewModel>
);

ReactDOM.render(<Index />, document.getElementById('root'));
