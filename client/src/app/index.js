import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './../css/core.css';
import Home from './home';
import Trips from './trips';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/trips" component={Trips} />
  </Switch>
);

export default App;
