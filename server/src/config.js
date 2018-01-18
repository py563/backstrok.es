/* @flow */
import dotenv from 'dotenv';

export type BackstrokesConfiguration = {
  concurrentCalls: number,
  distanceUnit: 'miles' | 'km',
  limit: number,
  passLimit: number,
  radiusHome: number,
  radiusCity: number,
  tripMinimum: number,
};

export type GeocodeConfiguration = {
  appId: string,
};

export type Configuration = {
  backstrokes: BackstrokesConfiguration,
  foursquare: {
    secrets: {
      clientId: string,
      clientSecret: string,
      redirectUrl: string,
    },
    foursquare: {
      mode: 'foursquare' | 'swarm',
      version: string,
    },
    startYear: number,
    winston: {
      loggers: {
        default: {
          console: {
            level: string,
          },
        },
      },
    },
  },
  geocode: GeocodeConfiguration,
  server: {
    port: number,
    session: {
      secret: string,
      maxAge: number,
      impl: 'memory' | 'db',
    },
  },
};

dotenv.config();

const config: Configuration = {
  backstrokes: {
    concurrentCalls: parseInt(process.env.LIMIT_CALLS, 10) || 3,
    distanceUnit: 'miles',
    limit: parseInt(process.env.LIMIT_RESULTS, 10) || 250,
    passLimit: parseInt(process.env.LIMIT_PASSES, 10) || 10,
    radiusHome: 50,
    radiusCity: 20,
    tripMinimum: 2,
  },
  foursquare: {
    foursquare: {
      mode: 'swarm',
      version: '20180118',
    },
    secrets: {
      clientId: process.env.FSQ_CLIENT_ID || '',
      clientSecret: process.env.FSQ_CLIENT_SECRET || '',
      redirectUrl: process.env.FSQ_REDIRECT || '',
    },
    startYear: 2009,
    winston: {
      loggers: {
        default: {
          console: {
            level: 'enter',
          },
        },
      },
    },
  },
  geocode: {
    appId: process.env.GEOCODE_APP_ID || '',
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 9090,
    session: {
      secret: process.env.SESSION_SECRET || 'sekret',
      maxAge: 60000,
      impl: 'memory',
    },
  },
};

export default config;
