/* @flow */
import winston from 'winston';
import moment from 'moment';

import backstroke from './../backstroke';

import type { $Application, NextFunction, Router, $Response } from 'express';

import type { Configuration } from './../config';
import type { SessionEnabledRequest } from './auth';

const logger = winston.createLogger({
  level: 'debug',
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default (
  app: $Application,
  router: Router,
  restrict: Function,
  config: Configuration
) => {
  const Backstrokes = backstroke(config);

  router
    .route('/trips')
    .get(
      restrict,
      async (
        request: SessionEnabledRequest & {
          query: ?{
            start: string,
            end: string,
          },
        },
        response: $Response,
        _next: NextFunction
      ) => {
        logger.debug('REQUESTING: /api/clusters');
        const { session, query } = request;
        const { foursquare } = session;
        const { accessToken } = foursquare || {};

        const before = moment(query.end).toDate() || new Date();
        const after = query.start
          ? moment(query.start).toDate()
          : moment(before)
            .subtract(1, 'year')
            .toDate();

        const trips = await Backstrokes.genTripCollection(
          before,
          after,
          accessToken
        );

        response.json(trips);
      }
    );

  router
    .route('/trips')
    .get(
      restrict,
      async (
        request: SessionEnabledRequest & {
          query: ?{
            start: string,
            end: string,
          },
        },
        response: $Response,
        _next: NextFunction
      ) => {
        logger.debug('REQUESTING: /api/clusters');
        const { session, query } = request;
        const { foursquare } = session;
        const { accessToken } = foursquare || {};

        const before = moment(query.end).toDate() || new Date();
        const after =
          moment(query.start).toDate() ||
          moment(before)
            .subtract(1, 'year')
            .toDate();

        const checkins = await Backstrokes.genClusters(
          before,
          after,
          accessToken
        );

        response.json(checkins);
      }
    );

  router
    .route('/clusters')
    .get(
      restrict,
      async (
        request: SessionEnabledRequest & {
          query: ?{
            start: string,
            end: string,
          },
        },
        response: $Response,
        _next: NextFunction
      ) => {
        logger.debug('REQUESTING: /api/clusters');
        const { session, query } = request;
        const { foursquare } = session;
        const { accessToken } = foursquare || {};

        const before = moment(query.end).toDate() || new Date();
        const after =
          moment(query.start).toDate() ||
          moment(before)
            .subtract(1, 'year')
            .toDate();

        const checkins = await Backstrokes.genClusters(
          before,
          after,
          accessToken
        );

        response.json(checkins);
      }
    );

  router
    .route('/checkins')
    .get(
      restrict,
      async (
        request: SessionEnabledRequest & {
          query: ?{
            start: string,
            end: string,
          },
        },
        response: $Response,
        _next: NextFunction
      ) => {
        logger.debug('REQUESTING: /api/checkins');
        const { session, query } = request;
        const { foursquare } = session;
        const { accessToken } = foursquare || {};

        const before = moment(query.end).toDate() || new Date();
        const after =
          moment(query.start).toDate() ||
          moment(before)
            .subtract(1, 'year')
            .toDate();

        const checkins = await Backstrokes.genCheckins(
          before,
          after,
          accessToken
        );

        response.json(checkins);
      }
    );
};
