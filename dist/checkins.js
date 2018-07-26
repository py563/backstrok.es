'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBackstrokesCheckin = exports.comparator = undefined;

var _relativeDate = require('relative-date');

var _relativeDate2 = _interopRequireDefault(_relativeDate);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var comparator = exports.comparator = function comparator(o1, o2) {
  if (!o1 && !o2) {
    return 0;
  }
  if (!o1) {
    return -1;
  }
  if (!o2) {
    return 1;
  }
  if (!o1.createdAt && !o2.createdAt) {
    return 0;
  }
  if (!o1.createdAt) {
    return -1;
  }
  if (!o2.createdAt) {
    return 1;
  }
  if (o1.createdAt === o2.createdAt) {
    return 0;
  }
  if (o1.createdAt > o2.createdAt) {
    return 1;
  }
  return -1;
};

var toBackstrokesCheckin = exports.toBackstrokesCheckin = function toBackstrokesCheckin(checkin) {
  var createdAt = checkin.createdAt,
      id = checkin.id,
      photos = checkin.photos,
      shout = checkin.shout,
      timeZoneOffset = checkin.timeZoneOffset,
      venue = checkin.venue;
  var categories = venue.categories,
      location = venue.location,
      name = venue.name,
      verified = venue.verified,
      stats = venue.stats,
      beenHere = venue.beenHere;
  var city = location.city,
      crossStreet = location.crossStreet,
      lat = location.lat,
      lng = location.lng,
      postalCode = location.postalCode,
      state = location.state,
      street = location.street;

  var d = _moment2.default.unix(createdAt).utcOffset(timeZoneOffset);

  return {
    categories,
    city,
    created: d.toDate(),
    createdDate: (0, _moment2.default)(d).format('ddd, MMM Do, YYYY'),
    createdEpoch: createdAt,
    createdSince: (0, _relativeDate2.default)(d.toDate()),
    createdTime: (0, _moment2.default)(d).format('h:mma'),
    crossStreet,
    id,
    location: {
      lat,
      lng
    },
    name,
    photos: photos.count > 0 ? photos.items : [],
    postalCode,
    shout,
    state,
    street,
    venue: {
      verified,
      stats,
      beenHere
    },
    getCoordinates: function getCoordinates() {
      return {
        lat,
        lng
      };
    }
  };
};

exports.default = {
  comparator,
  toBackstrokesCheckin
};