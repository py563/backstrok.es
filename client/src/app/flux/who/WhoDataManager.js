/*
 * @flow
 */

import FoursquareAPI from './../FoursquareAPI';
import Dispatcher from './WhoDispatcher';

export default {
  genLoad: async () => {
    const reply = await FoursquareAPI.genWho();
    const { apiStatus, foursquare } = reply;

    Dispatcher.dispatch({
      type: 'who/foursquare',
      isHere: apiStatus === 'OK' && !!foursquare,
      who: foursquare,
    });
  },
};
