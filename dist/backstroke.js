'use strict';

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _nodeFoursquare = require('node-foursquare');

var _nodeFoursquare2 = _interopRequireDefault(_nodeFoursquare);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _checkins = require('./checkins');

var _checkins2 = _interopRequireDefault(_checkins);

var _geocluster = require('./geocluster');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function getEpoch(date) {
  return Math.round(date.getTime() / 1000);
}

var Backstroke = function Backstroke(config) {
  var retrieveCheckinSet = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(offset, before, after, accessToken) {
      var results;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              logger.debug('ENTERING: retrieveCheckinSet, offset=' + offset);
              _context.next = 3;
              return _util2.default.promisify(Foursquare.Users.getSelfCheckins)({
                limit,
                beforeTimestamp: getEpoch(before),
                afterTimestamp: getEpoch(after),
                offset
              }, accessToken);

            case 3:
              results = _context.sent;
              return _context.abrupt('return', results.checkins || {});

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function retrieveCheckinSet(_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }();

  var genClusters = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(before, after, accessToken) {
      var checkins;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return genCheckins(before, after, accessToken);

            case 2:
              checkins = _context2.sent;
              return _context2.abrupt('return', (0, _geocluster.getClusters)(checkins));

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function genClusters(_x5, _x6, _x7) {
      return _ref2.apply(this, arguments);
    };
  }();

  var genCheckins = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(before, after, accessToken) {
      var fetchBatch = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
          var _this = this;

          var results, awaitables, rawResults;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  results = [];
                  awaitables = [].concat(_toConsumableArray(Array(concurrentCalls))).map(function () {
                    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_, i) {
                      var awaitable;
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              _context3.next = 2;
                              return retrieveCheckinSet(i * limit + baseOffset, before, after, accessToken);

                            case 2:
                              awaitable = _context3.sent;
                              return _context3.abrupt('return', awaitable);

                            case 4:
                            case 'end':
                              return _context3.stop();
                          }
                        }
                      }, _callee3, _this);
                    }));

                    return function (_x11, _x12) {
                      return _ref5.apply(this, arguments);
                    };
                  }());
                  _context4.next = 4;
                  return Promise.all(awaitables);

                case 4:
                  rawResults = _context4.sent;


                  rawResults.forEach(function (set) {
                    results = results.concat(set.items);
                  });

                  keepFetching = _underscore2.default.last(rawResults).items.length === limit;

                  passTotal += 1;
                  return _context4.abrupt('return', results);

                case 9:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        return function fetchBatch() {
          return _ref4.apply(this, arguments);
        };
      }();

      var allCheckins, baseOffset, keepFetching, passTotal, batch;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              logger.debug('ENTERING: retrieveCheckins');

              allCheckins = [];
              baseOffset = 0;
              keepFetching = true;
              passTotal = 0;

            case 5:
              if (!(keepFetching && passTotal < passLimit)) {
                _context5.next = 13;
                break;
              }

              _context5.next = 8;
              return fetchBatch();

            case 8:
              batch = _context5.sent;

              baseOffset += limit * concurrentCalls;
              allCheckins = allCheckins.concat(batch);
              _context5.next = 5;
              break;

            case 13:

              if (passLimit === passTotal && keepFetching) {
                logger.warn('Results were truncated after ' + passTotal + ' passes');
              }

              logger.info('RETRIEVED: ' + allCheckins.length + ' checkins in ' + passTotal + ' pass(es) of ' + concurrentCalls + ' calls each.');

              allCheckins.sort(_checkins2.default.comparator);
              return _context5.abrupt('return', allCheckins.map(function (checkin) {
                return _checkins2.default.toBackstrokesCheckin(checkin);
              }));

            case 17:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function genCheckins(_x8, _x9, _x10) {
      return _ref3.apply(this, arguments);
    };
  }();

  var genTrips = function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(before, after, accessToken) {
      var clusters, trips;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return genClusters(before, after, accessToken);

            case 2:
              clusters = _context6.sent;
              trips = clusters.map(function (cluster) {
                var centroid = cluster.centroid,
                    radius = cluster.radius,
                    locations = cluster.locations;


                var startDate = _underscore2.default.first(locations).created;
                var endDate = _underscore2.default.last(locations).created;
                var start = (0, _moment2.default)(startDate).format('MMMM D, YYYY');
                var end = (0, _moment2.default)(endDate).format('MMMM D, YYYY');
                var rangeStart = (0, _moment2.default)(startDate).format('MM/DD');
                var rangeEnd = (0, _moment2.default)(endDate).format('MM/DD');
                var range = rangeStart === rangeEnd ? rangeStart : rangeStart + ' to ' + rangeEnd;
                var cities = countUp(_underscore2.default.pluck(locations, 'city'), true);
                var states = countUp(_underscore2.default.pluck(locations, 'state'), true);
                var city = cities[0] ? cities[0].value : '';
                var state = states[0] ? states[0].value : '';

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
                  state
                };
              });
              return _context6.abrupt('return', trips);

            case 5:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function genTrips(_x13, _x14, _x15) {
      return _ref6.apply(this, arguments);
    };
  }();

  var genTripCollection = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(before, after, accessToken) {
      var trips, rangeStart, rangeEnd, range, totalCheckins;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return genTrips(before, after, accessToken);

            case 2:
              trips = _context7.sent;
              rangeStart = (0, _moment2.default)(after).format('MM/YYYY');
              rangeEnd = (0, _moment2.default)(before).format('MM/YYYY');
              range = rangeStart === rangeEnd ? rangeStart : rangeStart + ' to ' + rangeEnd;
              totalCheckins = _underscore2.default.pluck(trips, 'count').reduce(function (acc, value) {
                return acc += value;
              });
              return _context7.abrupt('return', {
                end: (0, _moment2.default)(before).format('MMMM D, YYYY'),
                endDate: before,
                range,
                start: (0, _moment2.default)(after).format('MMMM D, YYYY'),
                startDate: after,
                totalCheckins,
                totalTrips: trips.length,
                trips
              });

            case 8:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function genTripCollection(_x16, _x17, _x18) {
      return _ref7.apply(this, arguments);
    };
  }();

  var backstrokes = config.backstrokes;

  var logger = _winston2.default.createLogger({
    transports: [new _winston2.default.transports.Console()]
  });
  var Foursquare = (0, _nodeFoursquare2.default)(config.nodeFoursquare);

  var concurrentCalls = backstrokes.concurrentCalls,
      limit = backstrokes.limit,
      passLimit = backstrokes.passLimit;


  var countUp = function countUp(array, truthy) {
    var counts = {};

    _underscore2.default.each(array, function (item) {
      if (truthy && !item) {
        return;
      }

      if (!counts[item]) {
        counts[item] = {
          value: item,
          count: 1
        };
      } else {
        counts[item].count++;
      }
    });

    var results = _underscore2.default.sortBy(_underscore2.default.toArray(counts), function (item) {
      return -item.count;
    });

    return _underscore2.default.toArray(results);
  };

  return {
    genCheckins,
    genClusters,
    genTrips,
    genTripCollection
  };
};

exports = module.exports = Backstroke;