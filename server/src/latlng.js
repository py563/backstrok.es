/* @flow */
import util from 'util';
import logger from 'winston';
import maps from '@google/maps';

import type { GeocodeConfiguration } from './config';

export type Location = {
  lat: number,
  lng: number,
};

export type Distance = {
  start: Location,
  end: Location,
  miles: number,
  km: number,
};

const postalCodeCache = {};

/* Converts numeric degrees to radians */
function toRad(number: number): number {
  return number * Math.PI / 180;
}

var LatLng = function(config: GeocodeConfiguration) {
  const { appId } = config;

  const Maps = maps.createClient({
    key: appId,
    Promise: Promise,
  });

  async function genLocationByPostalCode(
    postalCode: string,
  ): Promise<?Location> {
    const cacheEntry = postalCodeCache[postalCode];

    if (cacheEntry) {
      logger.info(
        'RETRIEVED: ' + postalCode + ' from cache: ' + util.inspect(cacheEntry),
      );
      return cacheEntry;
    }

    logger.info(
      'RETRIEVING: Location data for ' + postalCode + ' from service.',
    );

    try {
      const result = await Maps.geocode({ address: postalCode }).asPromise();
      const { status } = result;

      if (status !== 200) {
        logger.error('LATLNG: service returned non-200 status: ' + status);
        return null;
      }

      const { json } = result;
      const { results } = json || {};

      if (!results || results.length === 0) {
        logger.info(
          'LATLNG: postalCode ' + postalCode + ' returned no results.',
        );
        return null;
      }

      // let's just go with the first result, for now.
      const { geometry } = results[0];
      const { location } = geometry;

      logger.info(
        'RETRIEVED: ' + postalCode + ' from service: ' + util.inspect(location),
      );

      postalCodeCache[postalCode] = location;

      return location;
    } catch (e) {
      logger.error('LATLNG: ' + e.message);
      return null;
    }
  }

  function getDistance(start: Location, end: Location): Distance {
    /* Props to MoveableType Scripts: http://www.movable-type.co.uk/scripts/latlong.html */
    const radius = 6371;
    const dLat = toRad(end.lat - start.lat);
    const dLon = toRad(end.lng - start.lng);

    const angle =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(start.lat)) *
        Math.cos(toRad(end.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const km =
      radius * (2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle)));
    const miles = km / 1.607;

    return {
      start,
      end,
      miles,
      km,
    };
  }

  return {
    getDistance,
    genLocationByPostalCode,
  };
};

exports = module.exports = LatLng;
