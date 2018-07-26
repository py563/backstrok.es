'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _nodeFoursquare = require('node-foursquare');

var _nodeFoursquare2 = _interopRequireDefault(_nodeFoursquare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logger = _winston2.default.createLogger({
  level: 'debug'
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new _winston2.default.transports.Console({
    format: _winston2.default.format.simple()
  }));
}

function sendWindowedResponse(json) {
  return `
    <html><body><script type="text/javascript">
      window.opener.postMessage(
        ${JSON.stringify(json)},
        window.opener.location,
      );
    </script></body></html>
  `;
}

exports.default = function (app, router, restrict, config) {
  var Foursquare = (0, _nodeFoursquare2.default)(config.nodeFoursquare);

  router.route('/login').get(function (request, response, _) {
    logger.debug('REQUESTING: /api/login');
    var location = Foursquare.getAuthClientRedirectUrl();
    response.redirect(location);
    response.end();
  });

  router.route('/callback').get(function (request, response, _) {
    logger.debug('REQUESTING: /callback/foursquare');
    var query = request.query;
    var code = query.code;


    if (typeof code !== 'string') {
      logger.error(`Error retrieving Access Token: malformed code`);
      response.send(sendWindowedResponse({
        auth: false,
        reason: 'Malformed code'
      }));
      return;
    }

    Foursquare.getAccessToken({
      code
    }, function (accessTokenError, accessToken) {
      if (accessTokenError) {
        logger.error(`Error retrieving Access Token: ${accessTokenError.message}`);
        response.send(sendWindowedResponse({
          auth: false,
          reason: accessTokenError.message
        }));
        return;
      }

      if (accessToken) {
        Foursquare.Users.getSelfDetails(accessToken, function (getUserError, user) {
          if (getUserError) {
            response.send(sendWindowedResponse({
              auth: false,
              reason: getUserError.message
            }));
          } else {
            request.session.foursquare = {
              user: user.user,
              accessToken
            };

            delete request.query.code;
            delete request.query.c;

            response.send(sendWindowedResponse({ auth: true }));
          }
        });
      } else {
        logger.error('No Access Token was received.');
        response.send(sendWindowedResponse({ auth: false, reason: 'no_token' }));
      }
    });
  });

  router.route('/who').get(restrict, function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response, _next) {
      var session, foursquare, _ref2, user;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              logger.debug('REQUESTING: /api/who');
              session = request.session;
              foursquare = session.foursquare;
              _ref2 = foursquare || {}, user = _ref2.user;


              response.json({
                foursquare: user
              });

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());

  router.route('/disconnect').get(function (request, response, _) {
    request.session.destroy(function () {
      response.redirect('/');
    });
  });
};