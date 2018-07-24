// @flow

import config from './config';
import nodeFoursquare from 'node-foursquare/dist/node-foursquare';
import 'babel-core/register';
import 'babel-polyfill';

console.log(config);
const thing = nodeFoursquare(config.nodeFoursquare);
thing.getAuthClientRedirectUrl();
