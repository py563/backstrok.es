'use strict';

var _relativeDate = require('relative-date');

var _relativeDate2 = _interopRequireDefault(_relativeDate);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _nodeFoursquare = require('node-foursquare');

var _nodeFoursquare2 = _interopRequireDefault(_nodeFoursquare);

var _latlng = require('./latlng');

var _latlng2 = _interopRequireDefault(_latlng);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function getEpoch(date) {
  return Math.round(date.getTime() / 1000);
}

_underscore2.default.mixin({
  countUp: function countUp(array, truthy) {
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
  }
});

function checkinComparator(o1, o2) {
  if (!o1 && !o2) {
    return 0;
  }
  if (!o1) {
    return -1;
  }
  if (!o2) {
    return 1;
  }
  if (!o1.createdAt && !o2.createdAt) {
    return 0;
  }
  if (!o1.createdAt) {
    return -1;
  }
  if (!o2.createdAt) {
    return 1;
  }
  if (o1.createdAt === o2.createdAt) {
    return 0;
  }
  if (o1.createdAt > o2.createdAt) {
    return 1;
  }
  return -1;
}

function convertFSQCheckin(checkin) {
  var comments = checkin.comments,
      createdAt = checkin.createdAt,
      id = checkin.id,
      photos = checkin.photos,
      shout = checkin.shout,
      timeZoneOffset = checkin.timeZoneOffset,
      venue = checkin.venue;
  var location = venue.location,
      name = venue.name;
  var city = location.city,
      crossStreet = location.crossStreet,
      lat = location.lat,
      lng = location.lng,
      postalCode = location.postalCode,
      state = location.state,
      street = location.street;

  var d = _moment2.default.unix(createdAt).utcOffset(timeZoneOffset);

  return {
    created: d.toDate(),
    id: id,
    createdDate: (0, _moment2.default)(d).format('ddd, MMM Do, YYYY'),
    createdTime: (0, _moment2.default)(d).format('h:mma'),
    createdEpoch: createdAt,
    createdSince: (0, _relativeDate2.default)(d),
    name: name,
    shout: shout,
    crossStreet: crossStreet,
    street: street,
    city: city,
    state: state,
    postalCode: postalCode,
    location: {
      lat: lat,
      lng: lng
    },
    photos: photos.count > 0 ? photos.photos : [],
    comments: comments.count > 0 ? comments.comments : []
  };
}

function buildTrip(checkins) {
  var startDate = _underscore2.default.first(checkins).created;
  var endDate = _underscore2.default.last(checkins).created;
  var start = startDate.format('MMMM D, YYYY');
  var end = endDate.format('MMMM D, YYYY');
  var rangeStart = startDate.format('MM/DD');
  var rangeEnd = endDate.format('MM/DD');
  var range = rangeStart === rangeEnd ? rangeStart : rangeStart + ' to ' + rangeEnd;
  var cities = _underscore2.default.countUp(_underscore2.default.pluck(checkins, 'city'), true);
  var states = _underscore2.default.countUp(_underscore2.default.pluck(checkins, 'state'), true);
  var city = cities[0] ? cities[0].value : '';
  var state = states[0] ? states[0].value : '';

  return {
    startDate: startDate,
    endDate: endDate,
    start: start,
    end: end,
    range: range,
    city: city,
    state: state,
    checkins: checkins,
    count: checkins.length
  };
}

var Backstroke = function Backstroke(config) {
  var retrieveCheckinSet = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(offset, before, after, accessToken) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              logger.debug('ENTERING: retrieveCheckinSet, offset=' + offset);

              return _context.abrupt('return', new Promise(function (resolve, reject) {
                return Foursquare.Users.getCheckins('self', {
                  limit: limit,
                  beforeTimestamp: getEpoch(before),
                  afterTimestamp: getEpoch(after),
                  offset: offset
                }, accessToken, function success(error, results) {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(results.checkins ? results.checkins.items || [] : []);
                  }
                });
              }));

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function retrieveCheckinSet(_x2, _x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  var genCheckins = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(before, after, accessToken) {
      var fetchBatch = function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
          var _this = this;

          var awaitables, rawResults, filteredResults, results;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  awaitables = [].concat(_toConsumableArray(Array(concurrentCalls))).map(function () {
                    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_, i) {
                      var awaitable;
                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return retrieveCheckinSet(i * limit + baseOffset, before, after, accessToken);

                            case 2:
                              awaitable = _context2.sent;
                              return _context2.abrupt('return', awaitable);

                            case 4:
                            case 'end':
                              return _context2.stop();
                          }
                        }
                      }, _callee2, _this);
                    }));

                    return function (_x9, _x10) {
                      return _ref5.apply(this, arguments);
                    };
                  }());
                  _context3.next = 3;
                  return Promise.all(awaitables);

                case 3:
                  rawResults = _context3.sent;
                  filteredResults = rawResults.filter(Boolean);

                  // Check the last result to see if it has as many checkins as the limit;
                  // that would mean we have more results.

                  keepFetching = _underscore2.default.last(filteredResults).length === limit;

                  results = filteredResults.reduce(function (a, b) {
                    return a.concat(b);
                  }, []);


                  passTotal += 1;
                  return _context3.abrupt('return', results);

                case 9:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        return function fetchBatch() {
          return _ref4.apply(this, arguments);
        };
      }();

      // Don't exceed the pass total in config.


      var allResults, baseOffset, keepFetching, passTotal, batch;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              logger.debug('ENTERING: retrieveCheckins');
              allResults = [];
              baseOffset = 0;
              keepFetching = true;
              passTotal = 0;

            case 5:
              if (!(keepFetching && passTotal < passLimit)) {
                _context4.next = 13;
                break;
              }

              _context4.next = 8;
              return fetchBatch();

            case 8:
              batch = _context4.sent;

              baseOffset += limit * concurrentCalls;
              allResults = allResults.concat(batch);
              _context4.next = 5;
              break;

            case 13:

              if (passLimit === passTotal && keepFetching) {
                logger.warn('Results were truncated after ' + passTotal + ' passes');
              }

              logger.info('RETRIEVED: ' + allResults.length + ' checkins in ' + passTotal + ' pass(es) of ' + concurrentCalls + ' calls each.');

              allResults.sort(checkinComparator);
              return _context4.abrupt('return', allResults.map(function (checkin) {
                return convertFSQCheckin(checkin);
              }));

            case 17:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function genCheckins(_x6, _x7, _x8) {
      return _ref3.apply(this, arguments);
    };
  }();

  var genTripCollection = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(postalCode, before, after) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var accessToken = arguments[4];
      var location, checkins;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              logger.debug('ENTERING: getTrips');

              if (!accessToken || !postalCode) {
                logger.error('retrieveTrips: No postalCode (' + postalCode + ') or no accessToken (' + accessToken + ')');
              }

              logger.info('RETRIEVING: trips for Postal Code ' + postalCode);
              _context5.next = 5;
              return LatLng.genLocationByPostalCode(postalCode);

            case 5:
              location = _context5.sent;

              if (location) {
                _context5.next = 8;
                break;
              }

              return _context5.abrupt('return', null);

            case 8:
              _context5.next = 10;
              return genCheckins(before, after, accessToken);

            case 10:
              checkins = _context5.sent;

              if (checkins) {
                _context5.next = 13;
                break;
              }

              return _context5.abrupt('return', null);

            case 13:
              return _context5.abrupt('return', buildTripsByLocation(checkins, location, before, after, options));

            case 14:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function genTripCollection(_x12, _x13, _x14) {
      return _ref6.apply(this, arguments);
    };
  }();

  var backstrokes = config.backstrokes,
      geocode = config.geocode,
      foursquare = config.foursquare;

  var LatLng = (0, _latlng2.default)(geocode);
  var Foursquare = (0, _nodeFoursquare2.default)(foursquare);
  var logger = require('winston');

  var concurrentCalls = backstrokes.concurrentCalls,
      distanceUnit = backstrokes.distanceUnit,
      limit = backstrokes.limit,
      passLimit = backstrokes.passLimit;


  function buildTripsByLocation(checkins, home, before, after) {
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var radiusHome = options.radiusHome || backstrokes.radiusHome;
    var radiusCity = options.radiusCity || backstrokes.radiusCity;
    var tripMinimum = options.tripMinimum || backstrokes.tripMinimum;

    var results = [];
    var trip = [];
    var qualifyingCheckins = 0;

    checkins.forEach(function (checkin) {
      var location = checkin.location;

      var _ref = location || {},
          lat = _ref.lat,
          lng = _ref.lng;

      // Check for latitude and longitude


      if (!lat || !lng) {
        return;
      }

      var checkinLocation = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };

      // Get the distance between the checkin's location and "home".
      var distance = LatLng.getDistance(home, checkinLocation);

      // If it's less than the boundary, just return (and discard).
      if (distance[distanceUnit] <= radiusHome) {
        return;
      }

      // If the current trip has no checkins...
      if (trip.length <= 0) {
        // ...but we already have trips stored...
        if (results.length > 0) {
          // ...check the distance of the last checkin of the last trip...
          if (LatLng.getDistance(_underscore2.default.last(_underscore2.default.last(results).checkins).location, checkinLocation)[distanceUnit] <= radiusCity) {
            // ... if it fits, add it to that trip and return...
            _underscore2.default.last(results).push(checkin);
            return;
          }
        }
        // ...otherwise, add it to the current, empty trip.
        trip.push(checkin);
        return;
      }

      // Get the first location of the first checkin in the trip.
      var firstLocation = _underscore2.default.first(trip).location;

      // If the distance between the first location and this checkin's location
      // is within the boundary...
      if (LatLng.getDistance(firstLocation, checkinLocation)[distanceUnit] <= radiusCity) {
        // ...add to the trip.
        trip.push(checkin);
        return;
      }

      // ... otherwise, process and add the trip. If the trip length is within
      // the minimum...
      if (trip.length >= tripMinimum) {
        // ...increment the qualifying checkins count.
        results.push(buildTrip(trip));
      }
      trip = [checkin];
    });

    if (trip.length >= tripMinimum) {
      qualifyingCheckins += trip.length;
      results.push(buildTrip(trip));
    }

    logger.info('BUILT: ' + results.length + ' trips using ' + qualifyingCheckins + ' of ' + checkins.length + ' checkins.');

    var rangeStart = (0, _moment2.default)(after).format('MM/YYYY');
    var rangeEnd = (0, _moment2.default)(before).format('MM/YYYY');
    var range = rangeStart === rangeEnd ? rangeStart : rangeStart + ' to ' + rangeEnd;

    return {
      totalCheckins: checkins.length,
      qualifyingCheckins: qualifyingCheckins,
      totalTrips: results.length,
      home: home,
      range: range,
      startDate: after,
      endDate: before,
      start: (0, _moment2.default)(after).format('MMMM D, YYYY'),
      end: (0, _moment2.default)(before).format('MMMM D, YYYY'),
      trips: results
    };
  }

  return {
    genTripCollection: genTripCollection,
    genCheckins: genCheckins
  };
};

exports = module.exports = Backstroke;