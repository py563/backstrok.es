'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _nodeFoursquare = require('node-foursquare');

var _nodeFoursquare2 = _interopRequireDefault(_nodeFoursquare);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _expressAsyncHandler = require('express-async-handler');

var _expressAsyncHandler2 = _interopRequireDefault(_expressAsyncHandler);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _checkins = require('./checkins');

var _checkins2 = _interopRequireDefault(_checkins);

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

exports.default = function (app, config) {
  var router = _express2.default.Router();
  var Foursquare = (0, _nodeFoursquare2.default)(config.nodeFoursquare);
  var restrict = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response, next) {
      var session, _session, foursquare, accessToken, _user;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              logger.debug(`BEFORE: ${request.url}`);
              logger.debug('Entering: /restrict');
              session = request.session;
              _session = session, foursquare = _session.foursquare;
              accessToken = process.env.ACCESS_TOKEN;

              if (!((!foursquare || !foursquare.accessToken) && accessToken)) {
                _context.next = 11;
                break;
              }

              _context.next = 8;
              return _util2.default.promisify(Foursquare.Users.getSelfDetails)(accessToken);

            case 8:
              _user = _context.sent;

              request.session.foursquare = { accessToken, user: _user };
              session = request.session;

            case 11:
              if (!session.foursquare) {
                _context.next = 14;
                break;
              }

              next();
              return _context.abrupt('return');

            case 14:

              response.status(401);
              response.send('Not Authorized');

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function restrict(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  (0, _auth2.default)(app, router, restrict, config);
  (0, _checkins2.default)(app, router, restrict, config);
  app.use('/api', router);

  app.use((0, _expressAsyncHandler2.default)(function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, response, next) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!request.route) {
                response.status(404);
                response.send('Not Found');
              }
              next();

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }()));
};