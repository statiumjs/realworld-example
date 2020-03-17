import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ViewModel from 'statium';

import ErrorBoundary from './ErrorBoundary.js';
import App from './App.js';

import './index.css';

const Index = () => (
    <ErrorBoundary>
        <ViewModel id="index" data={{ appName: 'Conduit' }}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={App} />
                </Switch>
            </BrowserRouter>
        </ViewModel>
    </ErrorBoundary>
);

ReactDOM.render(<Index />, document.getElementById('root'));
