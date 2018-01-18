'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _maps = require('@google/maps');

var _maps2 = _interopRequireDefault(_maps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var postalCodeCache = {};

/* Converts numeric degrees to radians */
function toRad(number) {
  return number * Math.PI / 180;
}

var LatLng = function LatLng(config) {
  var genLocationByPostalCode = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(postalCode) {
      var cacheEntry, geocode, status, json, _ref2, results, _results$, formatted_address, geometry, location, _lat, _lng, result;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              cacheEntry = postalCodeCache[postalCode];

              if (!cacheEntry) {
                _context.next = 4;
                break;
              }

              _winston2.default.info('RETRIEVED: ' + postalCode + ' from cache: ' + _util2.default.inspect(cacheEntry));
              return _context.abrupt('return', cacheEntry);

            case 4:

              _winston2.default.info('RETRIEVING: Location data for ' + postalCode + ' from service.');

              _context.prev = 5;
              _context.next = 8;
              return Maps.geocode({ address: postalCode }).asPromise();

            case 8:
              geocode = _context.sent;
              status = geocode.status;

              if (!(status !== 200)) {
                _context.next = 13;
                break;
              }

              _winston2.default.error('LATLNG: service returned non-200 status: ' + status);
              return _context.abrupt('return', null);

            case 13:
              json = geocode.json;
              _ref2 = json || {}, results = _ref2.results;

              if (!(!results || results.length === 0)) {
                _context.next = 18;
                break;
              }

              _winston2.default.info('LATLNG: postalCode ' + postalCode + ' returned no results.');
              return _context.abrupt('return', null);

            case 18:

              // let's just go with the first result, for now.
              _results$ = results[0], formatted_address = _results$.formatted_address, geometry = _results$.geometry;
              location = geometry.location;
              _lat = location.lat, _lng = location.lng;
              result = {
                display: formatted_address,
                lat: _lat,
                lng: _lng
              };


              _winston2.default.info('RETRIEVED: ' + postalCode + ' from service: ' + _util2.default.inspect(result));

              postalCodeCache[postalCode] = result;

              return _context.abrupt('return', result);

            case 27:
              _context.prev = 27;
              _context.t0 = _context['catch'](5);

              _winston2.default.error('LATLNG: ' + _context.t0.message);
              return _context.abrupt('return', null);

            case 31:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[5, 27]]);
    }));

    return function genLocationByPostalCode(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var appId = config.appId;


  var Maps = _maps2.default.createClient({
    key: appId,
    Promise: Promise
  });

  function getDistance(start, end) {
    /* Props to MoveableType Scripts: http://www.movable-type.co.uk/scripts/latlong.html */
    var radius = 6371;
    var dLat = toRad(end.lat - start.lat);
    var dLon = toRad(end.lng - start.lng);

    var angle = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var km = radius * (2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle)));
    var miles = km / 1.607;

    return {
      start: start,
      end: end,
      miles: miles,
      km: km
    };
  }

  return {
    getDistance: getDistance,
    genLocationByPostalCode: genLocationByPostalCode
  };
};

exports = module.exports = LatLng;