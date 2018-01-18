'use strict';

require('babel-core/register');

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

require('express-async-errors');

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = _config2.default.server;
var port = server.port,
    session = server.session;
var maxAge = session.maxAge,
    secret = session.secret;


app.use(require('express-session')({
  maxAge: maxAge,
  resave: true,
  saveUninitialized: true,
  secret: secret
}));

app.use(_express2.default.static(__dirname + '/public'));
(0, _routes.addRoutes)(app, _config2.default);
app.listen(port);
_winston2.default.info('Server started on port ' + port);

// import latlng from './latlng';
// const { geocode } = config;
// const LatLng = latlng(geocode);
// (async function() {
//   try {
//     const locationA = await LatLng.genLocationByPostalCode('11215');
//     const locationB = await LatLng.genLocationByPostalCode('10003');
//     if (locationA && locationB) {
//       const distance = LatLng.getDistance(locationA, locationB);
//       console.log('result', distance);
//     }
//   } catch (e) {
//     console.log('error', e);
//   }
// })();

// import backstroke from './backstroke';
// const Backstrokes = backstroke(config);
// (async function() {
//   try {
//     const accessToken = process.env.ACCESS_TOKEN || '';
//     const before = new Date();
//     const after = new Date();
//     after.setFullYear(2017);
//
//     const trips = await Backstrokes.genTripCollection(
//       '11215',
//       before,
//       after,
//       accessToken,
//     );
//
//     console.log('checkins', trips && trips.totalCheckins);
//   } catch (e) {
//     console.log('error', e);
//   }
// })();