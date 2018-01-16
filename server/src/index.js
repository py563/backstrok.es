const express = require('express');
const app = express();
const configs = require('./config');
const config = configs.getConfig('local');

app.use(
  require('express-session')({
    resave: true,
    maxAge: config.session.age,
    saveUninitialized: true,
    secret: config.session.secret,
  }),
);

app.use(express.static(`${__dirname}/public`));
require('./routes').addRoutes(app, config);

app.listen(9090);
