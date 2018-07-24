'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var postalCodeCache = {};

function toRad(number) {
  return number * (Math.PI / 180);
}

function locationsToCart() {
  var coords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return radToCart(coords.map(function (coord) {
    return {
      x: toRad(coord.lat),
      y: toRad(coord.lng)
    };
  }));
}

function radToCart() {
  var coords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return coords.map(function (coord) {
    var x = coord.x,
        y = coord.y;

    return {
      x: Math.cos(x) * Math.cos(y),
      y: Math.cos(x) * Math.sin(y),
      z: Math.sin(x)
    };
  });
}

var LatLng = function LatLng(config) {
  var genLocationByPostalCode = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(postalCode) {
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

    return function genLocationByPostalCode(_x3) {
      return _ref.apply(this, arguments);
    };
  }();

  var appId = config.appId;


  function getDistance(start, end) {
    var radius = 6371;
    var dLat = toRad(end.lat - start.lat);
    var dLon = toRad(end.lng - start.lng);

    var angle = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var km = radius * (2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle)));
    var miles = km / 1.607;

    return {
      start,
      end,
      miles,
      km
    };
  }

  function getMidpoint() {
    var locations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var allCarts = locationsToCart(locations);
    var f = function f(p, c, _, a) {
      return (p + c) / a.length;
    };
    var meanX = allCarts.map(function (cart) {
      return cart.x;
    }).reduce(f);
    var meanY = allCarts.map(function (cart) {
      return cart.y;
    }).reduce(f);
    var meanZ = allCarts.map(function (cart) {
      return cart.z;
    }).reduce(f);
    var hyp = Math.sqrt(meanX * meanX + meanY * meanY);

    var lat = toRad(Math.atan2(meanZ, hyp));
    var lng = toRad(Math.atan2(meanY, meanX));

    return { lat, lng };
  }

  return {
    getDistance,
    genLocationByPostalCode,
    getMidpoint
  };
};

exports = module.exports = LatLng;