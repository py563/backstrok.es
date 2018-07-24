/* @flow */
import dotenv from 'dotenv';
dotenv.config();

import 'babel-core/register';
import 'babel-polyfill';
import express from 'express';
import 'express-async-errors';
import winston from 'winston';
import expressSession from 'express-session';

import config from './config';
import { addRoutes } from './routes';

const app = express();
const { server } = config;
const { port, session } = server;
const { maxAge, secret } = session;

app.use(
  expressSession({
    maxAge,
    resave: true,
    saveUninitialized: true,
    secret,
  })
);

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

app.use(express.static(`${__dirname}/public`));
addRoutes(app, config);
app.listen(port);
logger.info('Server started on port ' + port);

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
