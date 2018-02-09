/*
 * @flow
 */

import type { FoursquareEntity, WhoResponse } from 'FoursquareAPI';

type GenWhoResult = {
  apiStatus: 'OK' | 'NOT_AUTHORIZED' | 'ERROR',
  foursquare: ?FoursquareEntity,
};

const FoursquareAPI = {
  async genWho(): Promise<GenWhoResult> {
    const who = ((await fetch('/api/who'): any): WhoResponse);

    if (who.status === 401) {
      return {
        apiStatus: 'NOT_AUTHORIZED',
        foursquare: null,
      };
    }

    if (who.status === 200) {
      return {
        apiStatus: 'OK',
        foursquare: who.foursquare,
      };
    }

    return {
      apiStatus: 'ERROR',
      foursquare: null,
    };
  },
};

export default FoursquareAPI;
