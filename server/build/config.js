'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();


var config = {
  backstrokes: {
    concurrentCalls: parseInt(process.env.LIMIT_CALLS, 10) || 3,
    distanceUnit: 'miles',
    limit: parseInt(process.env.LIMIT_RESULTS, 10) || 250,
    passLimit: parseInt(process.env.LIMIT_PASSES, 10) || 10,
    radiusHome: 50,
    radiusCity: 20,
    tripMinimum: 2
  },
  foursquare: {
    foursquare: {
      mode: 'swarm',
      version: '20180118'
    },
    secrets: {
      clientId: process.env.FSQ_CLIENT_ID || '',
      clientSecret: process.env.FSQ_CLIENT_SECRET || '',
      redirectUrl: process.env.FSQ_REDIRECT || ''
    },
    startYear: 2009,
    winston: {
      loggers: {
        default: {
          console: {
            level: 'enter'
          }
        }
      }
    }
  },
  geocode: {
    appId: process.env.GEOCODE_APP_ID || ''
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 9090,
    session: {
      secret: process.env.SESSION_SECRET || 'sekret',
      maxAge: 60000,
      impl: 'memory'
    }
  }
};

exports.default = config;