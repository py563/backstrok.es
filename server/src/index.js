/* @flow */
import 'babel-core/register';
import 'babel-polyfill';
import express from 'express';
import 'express-async-errors';

import latlng from './latlng';
import config from './config';
import { addRoutes } from './routes';

const { geocode } = config;
const LatLng = latlng(geocode);

const app = express();
const { server } = config;
const { port, session } = server;
const { maxAge, secret } = session;

app.use(
  require('express-session')({
    maxAge,
    resave: true,
    saveUninitialized: true,
    secret,
  }),
);

app.use(express.static(`${__dirname}/public`));
addRoutes(app, config);
app.listen(port);

(async function() {
  try {
    const locationA = await LatLng.genLocationByPostalCode('11215');
    const locationB = await LatLng.genLocationByPostalCode('10003');
    if (locationA && locationB) {
      const distance = LatLng.getDistance(locationA, locationB);
      console.log('result', distance);
    }
  } catch (e) {
    console.log('error', e);
  }
})();

/*
import backstroke from './backstroke';
const Backstrokes = backstroke(config);
(async function() {
  try {
    const accessToken = process.env.ACCESS_TOKEN || '';
    const before = new Date();
    const after = new Date();
    after.setFullYear(2015);

    const trips = await Backstrokes.retrieveTrips(
      '11215',
      before,
      after,
      accessToken,
    );

    console.log('checkins', trips && trips.totalCheckins);
  } catch (e) {
    console.log('error', e);
  }
})();*/
