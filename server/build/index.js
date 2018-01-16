'use strict';

var express = require('express');
var app = express();
var configs = require('./config');
var config = configs.getConfig('local');

app.use(require('express-session')({
  resave: true,
  maxAge: config.session.age,
  saveUninitialized: true,
  secret: config.session.secret
}));

app.use(express.static(__dirname + '/public'));
require('./routes').addRoutes(app, config);

app.listen(9090);