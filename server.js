require("babel/register");

var sys = require('util'),
  fs = require('fs'),
  querystring = require('querystring'),
  url = require('url'),
  _ = require('underscore'),
  express = require('express'),
  configs = require('./config').config,
  config = configs.getConfig(process.argv[2]),
  logger = require('winston');
  app = express();

var errorLogged = false;

function redisError(error) {
  if(!errorLogged) {
    logger.error('Redis Session store failed: ' + error);
    errorLogged = true;
  }
}

logger.info('Session store initialized in Memory');
app.use(require('express-session')({
  'resave': true,
  'maxAge' : config.session.age,
  'saveUninitialized': true,
  'secret' : config.session.secret,
}));

var engine = require('react-engine').server.create({
//  reactRoutes: <string> /* pass in the path to react-router routes optionally */
//  performanceCollector: <function> /* optional function to collect perf stats */
});

app.engine('.jsx', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.set('jsx', require('react-engine/lib/expressView'));
app.use(express.static(__dirname + '/public'));

require('./routes').addRoutes(app, config);
app.listen(config.port);
