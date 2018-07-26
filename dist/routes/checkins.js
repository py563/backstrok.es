'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _backstroke = require('./../backstroke');

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

exports.default = function (app, router, restrict, config) {
  var Backstrokes = (0, _backstroke2.default)(config);

  router.route('/trips').get(restrict, function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response, _next) {
      var session, query, foursquare, _ref2, accessToken, before, after, trips;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              logger.debug('REQUESTING: /api/clusters');
              session = request.session, query = request.query;
              foursquare = session.foursquare;
              _ref2 = foursquare || {}, accessToken = _ref2.accessToken;
              before = (0, _moment2.default)(query.end).toDate() || new Date();
              after = query.start ? (0, _moment2.default)(query.start).toDate() : (0, _moment2.default)(before).subtract(1, 'year').toDate();
              _context.next = 8;
              return Backstrokes.genTripCollection(before, after, accessToken);

            case 8:
              trips = _context.sent;


              response.json(trips);

            case 10:
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

  router.route('/trips').get(restrict, function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, response, _next) {
      var session, query, foursquare, _ref4, accessToken, before, after, checkins;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              logger.debug('REQUESTING: /api/clusters');
              session = request.session, query = request.query;
              foursquare = session.foursquare;
              _ref4 = foursquare || {}, accessToken = _ref4.accessToken;
              before = (0, _moment2.default)(query.end).toDate() || new Date();
              after = (0, _moment2.default)(query.start).toDate() || (0, _moment2.default)(before).subtract(1, 'year').toDate();
              _context2.next = 8;
              return Backstrokes.genClusters(before, after, accessToken);

            case 8:
              checkins = _context2.sent;


              response.json(checkins);

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x4, _x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());

  router.route('/clusters').get(restrict, function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request, response, _next) {
      var session, query, foursquare, _ref6, accessToken, before, after, checkins;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              logger.debug('REQUESTING: /api/clusters');
              session = request.session, query = request.query;
              foursquare = session.foursquare;
              _ref6 = foursquare || {}, accessToken = _ref6.accessToken;
              before = (0, _moment2.default)(query.end).toDate() || new Date();
              after = (0, _moment2.default)(query.start).toDate() || (0, _moment2.default)(before).subtract(1, 'year').toDate();
              _context3.next = 8;
              return Backstrokes.genClusters(before, after, accessToken);

            case 8:
              checkins = _context3.sent;


              response.json(checkins);

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x7, _x8, _x9) {
      return _ref5.apply(this, arguments);
    };
  }());

  router.route('/checkins').get(restrict, function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(request, response, _next) {
      var session, query, foursquare, _ref8, accessToken, before, after, checkins;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              logger.debug('REQUESTING: /api/checkins');
              session = request.session, query = request.query;
              foursquare = session.foursquare;
              _ref8 = foursquare || {}, accessToken = _ref8.accessToken;
              before = (0, _moment2.default)(query.end).toDate() || new Date();
              after = (0, _moment2.default)(query.start).toDate() || (0, _moment2.default)(before).subtract(1, 'year').toDate();
              _context4.next = 8;
              return Backstrokes.genCheckins(before, after, accessToken);

            case 8:
              checkins = _context4.sent;


              response.json(checkins);

            case 10:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function (_x10, _x11, _x12) {
      return _ref7.apply(this, arguments);
    };
  }());
};