require('node-jsx').install({extension: '.jsx'});
const express = require('express');
const configs = require('./config').config;

const config = configs.getConfig(process.argv[2]);
const logger = require('winston');

const app = express();

logger.info('Session store initialized in Memory');
app.use(
  require('express-session')({
    resave: true,
    maxAge: config.session.age,
    saveUninitialized: true,
    secret: config.session.secret,
  }),
);

app.set('views', `${__dirname}/views`);
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine());

app.use(express.static(`${__dirname}/public`));

require('./routes').addRoutes(app, config);

app.listen(config.port);
