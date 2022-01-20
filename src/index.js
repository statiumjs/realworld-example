import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary.jsx';
import App from './App.jsx';

const Index = () => (
	<ErrorBoundary>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ErrorBoundary>
);

ReactDOM.render(<Index />, document.getElementById('root'));
