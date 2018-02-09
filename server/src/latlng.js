/* @flow */
import util from 'util';
import logger from 'winston';
import maps from '@google/maps';

import type { GeocodeConfiguration } from './config';

export type Location = {
  lat: number,
  lng: number,
};

type CartesianCoords = {
  x: number,
  y: number,
  z: number,
};

type RadianCoords = {
  x: number,
  y: number,
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
  return number * (Math.PI / 180);
}

function locationsToCart(coords: Array<Location> = []): Array<CartesianCoords> {
  return radToCart(
    coords.map(coord => {
      return {
        x: toRad(coord.lat),
        y: toRad(coord.lng),
      };
    }),
  );
}

function radToCart(coords: Array<RadianCoords> = []): Array<CartesianCoords> {
  return coords.map((coord: RadianCoords) => {
    const { x, y } = coord;
    return {
      x: Math.cos(x) * Math.cos(y),
      y: Math.cos(x) * Math.sin(y),
      z: Math.sin(x),
    };
  });
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
      const geocode = await Maps.geocode({ address: postalCode }).asPromise();
      const { status } = geocode;

      if (status !== 200) {
        logger.error('LATLNG: service returned non-200 status: ' + status);
        return null;
      }

      const { json } = geocode;
      const { results } = json || {};

      if (!results || results.length === 0) {
        logger.info(
          'LATLNG: postalCode ' + postalCode + ' returned no results.',
        );
        return null;
      }

      // let's just go with the first result, for now.
      const { formatted_address, geometry } = results[0];
      const { location } = geometry;
      const { lat, lng } = location;

      const result = {
        display: formatted_address,
        lat,
        lng,
      };

      logger.info(
        'RETRIEVED: ' + postalCode + ' from service: ' + util.inspect(result),
      );

      postalCodeCache[postalCode] = result;

      return result;
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

  function getMidpoint(locations: Array<Location> = []): Location {
    // Props to gboone: https://gist.github.com/gboone/3cfa9a7df228854ec3a9
    const allCarts = locationsToCart(locations);
    const f = (p: number, c: number, _, a: Array<number>) => (p + c) / a.length;
    const meanX = allCarts.map(cart => cart.x).reduce(f);
    const meanY = allCarts.map(cart => cart.y).reduce(f);
    const meanZ = allCarts.map(cart => cart.z).reduce(f);
    const hyp = Math.sqrt(meanX * meanX + meanY * meanY);

    const lat = toRad(Math.atan2(meanZ, hyp));
    const lng = toRad(Math.atan2(meanY, meanX));

    return { lat, lng };
  }

  return {
    getDistance,
    genLocationByPostalCode,
    getMidpoint,
  };
};

exports = module.exports = LatLng;
