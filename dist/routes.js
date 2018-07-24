'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRoutes = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _nodeFoursquare = require('node-foursquare');

var _nodeFoursquare2 = _interopRequireDefault(_nodeFoursquare);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _expressAsyncHandler = require('express-async-handler');

var _expressAsyncHandler2 = _interopRequireDefault(_expressAsyncHandler);

var _backstroke = require('./backstroke');

var _backstroke2 = _interopRequireDefault(_backstroke);

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

function addRoutes(app, config) {
  var _this = this;

  var genUser = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(accessToken) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', new Promise(function (resolve, reject) {
                return Foursquare.Users.getSelfDetails(accessToken, function success(error, results) {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(results.user);
                  }
                });
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function genUser(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var restrict = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, response, next) {
      var session, _session, foursquare, accessToken, user;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              logger.debug(`BEFORE: ${request.url}`);
              logger.debug('Entering: /restrict');
              session = request.session;
              _session = session, foursquare = _session.foursquare;
              accessToken = process.env.ACCESS_TOKEN;

              if (!((!foursquare || !foursquare.accessToken) && accessToken)) {
                _context2.next = 11;
                break;
              }

              _context2.next = 8;
              return genUser(accessToken);

            case 8:
              user = _context2.sent;

              request.session.foursquare = { accessToken, user };
              session = request.session;

            case 11:
              if (!session.foursquare) {
                _context2.next = 14;
                break;
              }

              next();
              return _context2.abrupt('return');

            case 14:

              response.status(401);
              console.log(1);
              response.send('Not Authorized');

            case 17:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function restrict(_x2, _x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  var router = _express2.default.Router();
  var Foursquare = (0, _nodeFoursquare2.default)(config.nodeFoursquare);
  var Backstroke = (0, _backstroke2.default)(config, Foursquare);

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

            console.log(request.session);

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
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request, response, _next) {
      var session, foursquare, _ref4, user;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              logger.debug('REQUESTING: /api/who');
              session = request.session;
              foursquare = session.foursquare;
              _ref4 = foursquare || {}, user = _ref4.user;


              response.json({
                foursquare: user
              });

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x5, _x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }());

  router.route('/disconnect').get(function (request, response, _) {
    request.session.destroy(function () {
      response.redirect('/');
    });
  });

  router.route('/checkins').get(restrict, function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(request, response, _) {
      var session, params, query, foursquare, _ref6, accessToken, checkinSet;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              logger.debug('REQUESTING: /trips/:postalCode');
              session = request.session, params = request.params, query = request.query;
              foursquare = session.foursquare;
              _ref6 = foursquare || {}, accessToken = _ref6.accessToken;
              _context4.next = 6;
              return Backstroke.genCheckins(new Date(1532200086 * 1000), new Date(1500595200 * 1000), accessToken);

            case 6:
              checkinSet = _context4.sent;

              response.json(checkinSet);

            case 8:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this);
    }));

    return function (_x8, _x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }());

  router.route('/trips/:postalCode').get(restrict, function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(request, response, _) {
      var session, params, query, foursquare, _ref8, accessToken, postalCode, options, endDate, startDate, _ey, _em, _sy, _sm, _hr, _cr, _tm, startMonth, startYear, endMonth, endYear, tripCollection;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              logger.debug('REQUESTING: /trips/:postalCode');
              session = request.session, params = request.params, query = request.query;
              foursquare = session.foursquare;
              _ref8 = foursquare || {}, accessToken = _ref8.accessToken;
              postalCode = params.postalCode;

              if (postalCode) {
                _context5.next = 9;
                break;
              }

              response.status(401);
              response.send('Postal Code invalid or not provided');
              return _context5.abrupt('return');

            case 9:
              options = {};
              endDate = (0, _moment2.default)().endOf('month');
              startDate = (0, _moment2.default)().startOf('month').subtract(1, 'year');


              if (query) {
                _ey = query.ey, _em = query.em, _sy = query.sy, _sm = query.sm, _hr = query.hr, _cr = query.cr, _tm = query.tm;


                if (_sm && _sy) {
                  startMonth = parseInt(_sm, 10);
                  startYear = parseInt(_sy, 10);

                  startDate.month(startMonth - 1).year(startYear);
                }

                if (_em && _ey) {
                  endMonth = parseInt(_em, 10);
                  endYear = parseInt(_ey, 10);

                  endDate.month(endMonth - 1).year(endYear);
                }

                if (_hr) {
                  options.radiusHome = parseInt(_hr, 10);
                }

                if (_cr) {
                  options.radiusCity = parseInt(_cr, 10);
                }

                if (_tm) {
                  options.tripMinimum = parseInt(_tm, 10);
                }
              }

              logger.debug('Retrieving checkins to build trips.');

              _context5.next = 16;
              return Backstroke.genTripCollection(postalCode, endDate.toDate(), startDate.toDate(), options, accessToken);

            case 16:
              tripCollection = _context5.sent;


              response.json(tripCollection);

            case 18:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this);
    }));

    return function (_x11, _x12, _x13) {
      return _ref7.apply(this, arguments);
    };
  }());

  app.use('/api', router);

  app.use((0, _expressAsyncHandler2.default)(function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(request, response, next) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              console.log(request.route);
              if (!request.route) {
                console.log(2);
                response.status(404);
                response.send('Not Found');
              }
              next();

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this);
    }));

    return function (_x14, _x15, _x16) {
      return _ref9.apply(this, arguments);
    };
  }()));
}

exports.addRoutes = addRoutes;