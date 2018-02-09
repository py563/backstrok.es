/* @flow */

import React from 'react';
import { Container } from 'flux/utils';
import { Component } from 'react';

import WhoStore from '../who/WhoStore';
import Trips from '../../trips';

class TripsContainer extends Component {
  static getStores() {
    return [WhoStore];
  }

  static calculateState(prevState) {
    const who = WhoStore.getState();
    console.log(who);
    return {
      who,
    };
  }

  render() {
    return <Trips />;
  }
}

export default Container.create(TripsContainer);
