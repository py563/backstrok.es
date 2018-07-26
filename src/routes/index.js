/* @flow */

import express from 'express';
import winston from 'winston';
import nodeFoursquare from 'node-foursquare';
import util from 'util';
import asyncHandler from 'express-async-handler';

import auth from './auth';
import checkins from './checkins';

import type {
  $Application,
  NextFunction,
  Router,
  $Request,
  $Response,
} from 'express';

import type { Configuration } from './../config';

export type SessionEnabledRequest = $Request & {
  session: {
    destroy: Function,
    foursquare?: {
      accessToken: string,
      user: Object,
    },
  },
};

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

export default (app: $Application, config: Configuration) => {
  const router: Router = express.Router();
  const Foursquare = nodeFoursquare(config.nodeFoursquare);
  const restrict = async (
    request: SessionEnabledRequest,
    response: $Response,
    next: NextFunction
  ) => {
    logger.debug(`BEFORE: ${request.url}`);
    logger.debug('Entering: /restrict');
    let { session } = request;
    let { foursquare } = session;
    const accessToken = process.env.ACCESS_TOKEN;

    // If we have an access token in config, we're likely testing something, so
    // call for the current user.
    if ((!foursquare || !foursquare.accessToken) && accessToken) {
      const user = await util.promisify(Foursquare.Users.getSelfDetails)(
        accessToken
      );
      request.session.foursquare = { accessToken, user };
      session = request.session;
    }

    if (session.foursquare) {
      next();
      return;
    }

    response.status(401);
    response.send('Not Authorized');
  };

  auth(app, router, restrict, config);
  checkins(app, router, restrict, config);
  app.use('/api', router);

  app.use(
    asyncHandler(
      async (request: $Request, response: $Response, next: NextFunction) => {
        if (!request.route) {
          response.status(404);
          response.send('Not Found');
        }
        next();
      }
    )
  );
};
