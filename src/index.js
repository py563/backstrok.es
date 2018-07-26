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
import routes from './routes';

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

routes(app, config);

app.listen(port);
logger.info('Server started on port ' + port);
