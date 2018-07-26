'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

require('babel-core/register');

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

require('express-async-errors');

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var app = (0, _express2.default)();
var server = _config2.default.server;
var port = server.port,
    session = server.session;
var maxAge = session.maxAge,
    secret = session.secret;


app.use((0, _expressSession2.default)({
  maxAge,
  resave: true,
  saveUninitialized: true,
  secret
}));

var logger = _winston2.default.createLogger({
  level: 'info',
  transports: [new _winston2.default.transports.Console()]
});

app.use(_express2.default.static(`${__dirname}/public`));

(0, _routes2.default)(app, _config2.default);

app.listen(port);
logger.info('Server started on port ' + port);