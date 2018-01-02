import React from 'react';
import ReactDOM from 'react-dom';
import './css/core.css';
import './css/home.css';
import './css/trips.css';
import Home from './views/Home';
import registerServiceWorker from './scripts/registerServiceWorker';

ReactDOM.render(<Home />, document.getElementById('root'));
registerServiceWorker();
