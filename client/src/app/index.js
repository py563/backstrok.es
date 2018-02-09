import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './../css/core.css';
import Home from './home';
import TripsContainer from './flux/containers/TripsContainer';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/trips" component={TripsContainer} />
  </Switch>
);

export default App;
