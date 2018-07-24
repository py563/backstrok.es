'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _nodeFoursquare = require('node-foursquare/dist/node-foursquare');

var _nodeFoursquare2 = _interopRequireDefault(_nodeFoursquare);

require('babel-core/register');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_config2.default);
var thing = (0, _nodeFoursquare2.default)(_config2.default.nodeFoursquare);
thing.getAuthClientRedirectUrl();