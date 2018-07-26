/* @flow */
import winston from 'winston';
import nodeFoursquare from 'node-foursquare';

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

export type FoursquareUser = {
  id: string,
  firstName: string,
  lastName: string,
  gender: string,
  relationship: string,
  photo: {
    prefix: string,
    suffix: string,
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

function sendWindowedResponse(json: Object): string {
  return `
    <html><body><script type="text/javascript">
      window.opener.postMessage(
        ${JSON.stringify(json)},
        window.opener.location,
      );
    </script></body></html>
  `;
}

export default (
  app: $Application,
  router: Router,
  restrict: Function,
  config: Configuration
) => {
  const Foursquare = nodeFoursquare(config.nodeFoursquare);

  router
    .route('/login')
    .get(
      (
        request: SessionEnabledRequest,
        response: $Response,
        _: NextFunction
      ) => {
        logger.debug('REQUESTING: /api/login');
        const location = Foursquare.getAuthClientRedirectUrl();
        response.redirect(location);
        response.end();
      }
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
        _: NextFunction
      ) => {
        logger.debug('REQUESTING: /callback/foursquare');
        const { query } = request;
        const { code } = query;

        if (typeof code !== 'string') {
          logger.error(`Error retrieving Access Token: malformed code`);
          response.send(
            sendWindowedResponse({
              auth: false,
              reason: 'Malformed code',
            })
          );
          return;
        }

        Foursquare.getAccessToken(
          {
            code,
          },
          (accessTokenError: ?Error, accessToken: string) => {
            if (accessTokenError) {
              logger.error(
                `Error retrieving Access Token: ${accessTokenError.message}`
              );
              response.send(
                sendWindowedResponse({
                  auth: false,
                  reason: accessTokenError.message,
                })
              );
              return;
            }

            if (accessToken) {
              Foursquare.Users.getSelfDetails(
                accessToken,
                (getUserError: ?Error, user: Object) => {
                  if (getUserError) {
                    response.send(
                      sendWindowedResponse({
                        auth: false,
                        reason: getUserError.message,
                      })
                    );
                  } else {
                    request.session.foursquare = {
                      user: user.user,
                      accessToken,
                    };

                    delete request.query.code;
                    delete request.query.c;

                    response.send(sendWindowedResponse({ auth: true }));
                  }
                }
              );
            } else {
              logger.error('No Access Token was received.');
              response.send(
                sendWindowedResponse({ auth: false, reason: 'no_token' })
              );
            }
          }
        );
      }
    );

  router
    .route('/who')
    .get(
      restrict,
      async (
        request: SessionEnabledRequest,
        response: $Response,
        _next: NextFunction
      ) => {
        logger.debug('REQUESTING: /api/who');
        const { session } = request;
        const { foursquare } = session;
        const { user } = foursquare || {};

        response.json({
          foursquare: user,
        });
      }
    );

  router
    .route('/disconnect')
    .get(
      (
        request: SessionEnabledRequest,
        response: $Response,
        _: NextFunction
      ) => {
        request.session.destroy(() => {
          response.redirect('/');
        });
      }
    );
};
