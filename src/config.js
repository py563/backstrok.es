/* @flow */
import dotenv from 'dotenv';
dotenv.config();

const env = ((process.env: any): { [string]: string });
const { FSQ_CLIENT_ID, FSQ_CLIENT_SECRET, FSQ_REDIRECT } = env;

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
  nodeFoursquare: {
    secrets: {
      clientId: string,
      clientSecret: string,
      redirectUrl: string,
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
  nodeFoursquare: {
    secrets: {
      clientId: FSQ_CLIENT_ID,
      clientSecret: FSQ_CLIENT_SECRET,
      redirectUrl: FSQ_REDIRECT,
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
