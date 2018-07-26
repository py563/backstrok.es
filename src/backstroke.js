/* @flow */
import _ from 'underscore';
import moment from 'moment';
import util from 'util';
import nodeFoursquare from 'node-foursquare';
import winston from 'winston';

import Checkins from './checkins';
import {
  getClusters,
  getMilesThreshold,
  getKilometerThreshold,
} from './geocluster';

import type { Configuration } from './config';
import type { BackstrokesCheckin, FoursquareCheckin } from './checkins';
import type { Cluster } from './geocluster';

export type Trip = {
  startDate: Date,
  endDate: Date,
  start: string,
  end: string,
  range: string,
  city: string,
  state: string,
  checkins: Array<BackstrokesCheckin>,
  count: number,
};

export type TripCollection = {
  end: string,
  endDate: Date,
  range: string,
  start: string,
  startDate: Date,
  totalCheckins: number,
  totalTrips: number,
  trips: Array<Trip>,
};

type CheckinCallResult = { count: number, items: FoursquareCheckin };

function getEpoch(date: Date): number {
  return Math.round(date.getTime() / 1000);
}

const countUp = (
  array: Array<{ [key: string]: any }>,
  truthy: boolean
): Array<{ [key: string]: any }> => {
  const counts: { [value: any]: { value: any, count: number } } = {};

  _.each(array, item => {
    if (truthy && !item) {
      return;
    }

    if (!counts[item]) {
      counts[item] = {
        value: item,
        count: 1,
      };
    } else {
      counts[item].count++;
    }
  });

  return _.toArray(_.sortBy(_.toArray(counts), item => -item.count));
};

const Backstroke = function(config: Configuration) {
  const { backstrokes } = config;
  const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
  });
  const Foursquare = nodeFoursquare(config.nodeFoursquare);

  const { concurrentCalls, limit, passLimit } = backstrokes;

  async function retrieveCheckinSet(
    offset: number,
    before: Date,
    after: Date,
    accessToken: string
  ): Promise<CheckinCallResult> {
    logger.debug('ENTERING: retrieveCheckinSet, offset=' + offset);
    const results = await util.promisify(Foursquare.Users.getSelfCheckins)(
      {
        limit,
        beforeTimestamp: getEpoch(before),
        afterTimestamp: getEpoch(after),
        offset,
      },
      accessToken
    );
    return results.checkins || {};
  }

  async function genClusters(
    before: Date,
    after: Date,
    options: ?{
      radius?: number,
    } = {},
    accessToken: string
  ): Promise<Array<BackstrokesCheckin>> {
    const checkins = await genCheckins(before, after, accessToken);
    const threshold =
      config.distanceUnit === 'km'
        ? getKilometerThreshold(options.radius)
        : getMilesThreshold(options.radius);
    return getClusters(checkins, null, threshold);
  }

  async function genCheckins(
    before: Date,
    after: Date,
    accessToken: string
  ): Promise<?Array<BackstrokesCheckin>> {
    logger.debug('ENTERING: retrieveCheckins');

    let allCheckins = [];

    let baseOffset = 0;
    let keepFetching = true;
    let passTotal = 0;

    async function fetchBatch(): Promise<Array<FoursquareCheckin>> {
      let results = [];
      const awaitables = [...Array(concurrentCalls)].map(async (_, i) => {
        const awaitable = await retrieveCheckinSet(
          i * limit + baseOffset,
          before,
          after,
          accessToken
        );
        return awaitable;
      });

      const rawResults = await Promise.all(awaitables);

      rawResults.forEach((set: CheckinCallResult) => {
        results = results.concat(set.items);
      });

      keepFetching = _.last(rawResults).items.length === limit;

      passTotal += 1;
      return results;
    }

    // Don't exceed the pass total in config.
    while (keepFetching && passTotal < passLimit) {
      const batch = await fetchBatch();
      baseOffset += limit * concurrentCalls;
      allCheckins = allCheckins.concat(batch);
    }

    if (passLimit === passTotal && keepFetching) {
      logger.warn('Results were truncated after ' + passTotal + ' passes');
    }

    logger.info(
      'RETRIEVED: ' +
        allCheckins.length +
        ' checkins in ' +
        passTotal +
        ' pass(es) of ' +
        concurrentCalls +
        ' calls each.'
    );

    allCheckins.sort(Checkins.comparator);
    return allCheckins.map(checkin => Checkins.toBackstrokesCheckin(checkin));
  }

  async function genTrips(
    before: Date,
    after: Date,
    options: ?{
      radius?: number,
    } = {},
    accessToken: string
  ): Promise<Array<Trip>> {
    const clusters = await genClusters(before, after, options, accessToken);
    const trips = clusters.map((cluster: Cluster) => {
      const { centroid, radius, locations } = cluster;

      const startDate = _.first(locations).created;
      const endDate = _.last(locations).created;
      const start = moment(startDate).format('MMMM D, YYYY');
      const end = moment(endDate).format('MMMM D, YYYY');
      const rangeStart = moment(startDate).format('MM/DD');
      const rangeEnd = moment(endDate).format('MM/DD');
      const range =
        rangeStart === rangeEnd ? rangeStart : rangeStart + ' to ' + rangeEnd;
      const cities = countUp(_.pluck(locations, 'city'), true);
      const states = countUp(_.pluck(locations, 'state'), true);
      const city = cities[0] ? cities[0].value : '';
      const state = states[0] ? states[0].value : '';

      return {
        centroid,
        checkins: locations,
        city,
        count: locations.length,
        end,
        endDate,
        radius,
        range,
        start,
        startDate,
        state,
      };
    });

    return trips;
  }

  async function genTripCollection(
    before: Date,
    after: Date,
    options: ?{
      radius?: number,
    } = {},
    accessToken: string
  ): Promise<Array<TripCollection>> {
    const trips = await genTrips(before, after, options, accessToken);
    const rangeStart = moment(after).format('MM/YYYY');
    const rangeEnd = moment(before).format('MM/YYYY');
    const range =
      rangeStart === rangeEnd ? rangeStart : rangeStart + ' to ' + rangeEnd;
    const totalCheckins: number = _
      .pluck(trips, 'count')
      .reduce((acc: number, value: number) => (acc += value));

    return {
      end: moment(before).format('MMMM D, YYYY'),
      endDate: before,
      range,
      start: moment(after).format('MMMM D, YYYY'),
      startDate: after,
      totalCheckins,
      totalTrips: trips.length,
      trips,
    };
  }

  return {
    genCheckins,
    genClusters,
    genTrips,
    genTripCollection,
  };
};

exports = module.exports = Backstroke;
