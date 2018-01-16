/* @flow */
import express from 'express';
import logger from 'winston';
import foursquare from 'node-foursquare';

import type {
  $Application,
  NextFunction,
  Router,
  $Request,
  $Response,
} from 'express';

import backstroke from './backstroke';

import type { Configuration } from './config';

type SessionEnabledRequest = $Request & {
  session: {
    destroy: Function,
    foursquare?: {
      accessToken: string,
      user: {
        id: string,
        firstName: string,
        lastName: string,
        photo: {
          prefix: string,
          suffix: string,
        },
        type: 'user' | 'venue',
      },
    },
  },
};

// const USER = {
//   id: '62243',
//   firstName: 'Clint',
//   lastName: 'Hall',
//   gender: 'male',
//   relationship: 'self',
//   canonicalUrl: 'https://foursquare.com/clintandrewhall',
//   photo: {
//     prefix: 'https://igx.4sqi.net/img/user/',
//     suffix: '/62243_1257023213416.jpg',
//   },
//   friends: { count: 178, groups: [] },
//   tips: { count: 26 },
//   homeCity: 'Brooklyn, NY',
//   bio:
//     'User Interface Engineer at Facebook. My tweets, particularly the crazy ones, are my own.',
//   contact: {
//     phone: '8163080261',
//     verifiedPhone: 'false',
//     email: 'clintandrewhall@gmail.com',
//     twitter: 'clintandrewhall',
//     facebook: '500017755',
//   },
//   superuser: 2,
//   photos: { count: 516, items: [] },
//   checkinPings: 'off',
//   pings: false,
//   type: 'user',
//   mayorships: { count: 0, items: [] },
//   checkins: { count: 3349, items: [] },
//   requests: { count: 0 },
//   lists: { count: 16, groups: [] },
//   blockedStatus: 'none',
//   createdAt: 1255634222,
//   lenses: [],
//   referralId: 'u-62243',
// };
// const ACCESS_TOKEN = 'IBLDFRIVAINZHOF5OLKXSOS12VB4HMKNOGNXKZEE41CHCCUB';

function restrict(
  request: SessionEnabledRequest,
  response: $Response,
  next: NextFunction,
) {
  logger.debug(`BEFORE: ${request.url}`);
  logger.debug('Entering: /restrict');
  const session = { request };

  if (!session) {
    response.status(503);
    response.send('Session unavailable.');
    return;
  }

  if (session.foursquare) {
    next();
    return;
  }

  response.status(401);
  response.send('Not Authorized');
}

function sendResponse(json: Object): string {
  return `
    <html><body><script type="text/javascript">
      window.opener.postMessage(
        ${JSON.stringify(json)},
        window.opener.location
      );
    </script></body></html>
  `;
}

function addRoutes(app: $Application, config: Configuration) {
  const router: Router = express.Router();
  const Backstroke = backstroke(config);
  const Foursquare = foursquare(config.foursquare);

  router
    .route('/login')
    .get(
      (
        request: SessionEnabledRequest,
        response: $Response,
        _: NextFunction,
      ) => {
        logger.debug('REQUESTING: /api/login');
        const location = Foursquare.getAuthClientRedirectUrl();
        response.writeHead(303, { location });
        response.end();
      },
    );

  router
    .route('/callback')
    .get(
      (
        request: SessionEnabledRequest & {
          query?: ?{
            code?: ?string,
            r?: ?string,
          },
        },
        response: $Response,
        _: NextFunction,
      ) => {
        logger.debug('REQUESTING: /callback/foursquare');
        const { query } = request;
        const { code } = query;

        Foursquare.getAccessToken(
          {
            code,
          },
          (acError, accessToken) => {
            console.log('AT', accessToken);
            if (acError) {
              logger.error(`Error retrieving Access Token: ${acError.message}`);
              response.send(
                sendResponse({ auth: false, reason: 'acError.message' }),
              );
            } else if (accessToken) {
              Foursquare.Users.getUser('self', accessToken, (guError, user) => {
                if (guError) {
                  response.send(
                    sendResponse({ auth: false, reason: 'bad_user' }),
                  );
                } else {
                  request.session.foursquare = {
                    user: user.user,
                    accessToken,
                  };
                  delete request.query.code;
                  delete request.query.c;
                  response.send(sendResponse({ auth: true }));
                }
              });
            } else {
              logger.error('No Access Token was received.');
              response.send(sendResponse({ auth: false, reason: 'no_token' }));
            }
          },
        );
      },
    );

  router
    .route('/disconnect')
    .get(
      (
        request: SessionEnabledRequest,
        response: $Response,
        _: NextFunction,
      ) => {
        request.session.destroy(() => {
          response.redirect('/');
        });
      },
    );

  router
    .route('/trips')
    .get(
      restrict,
      async (
        request: SessionEnabledRequest & {
          params: ?{
            postalCode?: ?string,
          },
        },
        response: $Response,
        _: NextFunction,
      ) => {
        logger.debug('REQUESTING: /trips');
        const { session, params } = request;
        const { foursquare } = session;
        const { accessToken } = foursquare || {};
        const { postalCode } = params;

        // request.session.checkins = request.session.checkins || {};

        if (!postalCode) {
          response.status(401);
          response.send('Postal Code Invalid or not Provided');
          return;
        }

        // if (form.advanced) {
        //   const ey = parseInt(
        //     _.select(form.advanced.endYears, selected)[0].value,
        //     10,
        //   );
        //   const em = parseInt(
        //     _.select(form.advanced.endMonths, selected)[0].value,
        //     10,
        //   );
        //   const sy = parseInt(
        //     _.select(form.advanced.startYears, selected)[0].value,
        //     10,
        //   );
        //   const sm = parseInt(
        //     _.select(form.advanced.startMonths, selected)[0].value,
        //     10,
        //   );
        //   const before = new Date(ey, em + 1, 0, 0, 0, 0, 0);
        //   const after = new Date(sy, sm, 1, 0, 0, 0, 0);
        //
        //   options = {
        //     after,
        //     before,
        //     homeRadius: form.advanced.homeRadius,
        //     cityRadius: form.advanced.cityRadius,
        //     tripMinimum: form.advanced.tripMinimum,
        //   };
        // }

        logger.debug('Retrieving checkins to build trips.');

        const before = new Date();
        const after = new Date();
        after.setFullYear(2015);

        const tripCollection = await Backstroke.genTripCollection(
          postalCode,
          before,
          after,
          accessToken,
        );

        response.json(tripCollection);
      },
    );

  app.use('/api', router);
}

export { addRoutes };
