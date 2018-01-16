
var sys = require("util"),
  async = require("async"),
  relativeDate = require("relative-date"),
  moment = require('moment'),
  _ = require("underscore");

function setEpoch(date, epoch) {
  date.setTime(epoch * 1000);
  return date;
}

function getEpoch(date) {
  return Math.round(date.getTime() / 1000);
}

function mergeDefaults(o1, o2) {
  for(var a in o2) {
    if(typeof o1[a] == "undefined" || o1[a] == null) {
      o1[a] = o2[a];
    }
  }
}

_.mixin({
  "countUp" : function(array, truthy) {
    var counts = {};
    _.each(array, function(item) {

      if(truthy && !item) {
        return;
      }

      if(!counts[item]) {
        counts[item] = {
          "value" : item,
          "count" : 1
        };
      }
      else {
        counts[item].count++;
      }
    });
    var results = _.sortBy(_.toArray(counts), function(item) {
      return -item.count;
    });
    return _.toArray(results);
  }
});

var Backstroke = function(config) {
  var defaultOptions = config.defaults,
    LatLng = require('./latlng')(config),
    Foursquare = require("node-foursquare")(config.foursquare),
    logger = require('winston');

  function checkinComparator(o1, o2) {
    if(!o1 && !o2) { return 0; }
    if(!o1) { return -1; }
    if(!o2) { return 1; }
    if(!o1.createdAt && !o2.createdAt) { return 0; }
    if(!o1.createdAt) { return -1; }
    if(!o2.createdAt) { return 1; }
    if(o1.createdAt == o2.createdAt) { return 0; }
    if(o1.createdAt > o2.createdAt) { return 1; }
    return -1;
  }

  function createCheckin(c) {
    c.venue = c.venue || {};
    c.venue.location = c.venue.location || {};
    c.venue.categories = c.venue.categories || [];
    var d = moment.unix(c.createdAt).utcOffset(c.timeZoneOffset);
    //var d = d.add(c.timeZoneOffset, 'minutes');
    //d.setTimezone(c.timeZone);

    return {
      "created" : d,
      "id" : c.id,
      "createdDate" : moment(d).format('ddd, MMM Do, YYYY'),
      "createdTime" : moment(d).format('h:mma'),
      "createdEpoch" : c.createdAt,
      "createdSince" : relativeDate(d),
      "name" : c.venue.name,
      "shout" : c.shout,
      "categories" : c.venue.categories,
      "crossStreet" : c.venue.location.crossStreet,
      "street" : c.venue.location.street,
      "city" : c.venue.location.city,
      "state" : c.venue.location.state,
      "postalCode" : c.venue.location.postalCode,
      "location" : {
        "lat" : c.venue.location.lat,
        "lng" : c.venue.location.lng
      },
      "venue" : c.venue,
      "photos" : c.photos.count > 0 ? c.photos : null,
      "comments" : c.comments.count > 0 ? c.comments : null
    }
  }

  function buildTrip(checkins, number) {
    var startDate = _.first(checkins).created, endDate = _.last(checkins).created,
      start = startDate.format("MMMM D, YYYY"), end = endDate.format("MMMM D, YYYY"),
      rangeStart = startDate.format("MM/DD"),
      rangeText = startDate.isSame(endDate) ?
        rangeStart : (rangeStart + " to " + endDate.format("MM/DD")),
      cities = _.countUp(_.pluck(checkins, "city"), true),
      states = _.countUp(_.pluck(checkins, "state"), true),
      city = cities[0] ? cities[0].value : undefined,
      state = states[0] ? states[0].value : undefined;

    return {
      "number" : number,
      "startDate" : startDate,
      "endDate" : endDate,
      "start" : start,
      "end" : end,
      "range" : rangeText,
      "city" : city,
      "state" : state,
      "checkins" : checkins,
      "count" : checkins.length
    };
  }

  function buildTripsByZip(checkins, zip, options, callback) {
    LatLng.getLocationByZipCode(zip, function(error, location) {
      if(error) {
        callback(error);
      }
      else {
        buildTripsByLocation(checkins, location, options, function(error, trips) {
          if(error) {
            callback(error);
          }
          else {
            callback(null, trips, checkins, location);
          }
        });
      }
    });
  }

  function buildTripsByLocation(checkins, home, options, callback) {
    var results = [], trip = [], qualifyingCheckins = 0;

    options = options || {};
    mergeDefaults(options, defaultOptions);
    checkins.sort(checkinComparator);
    checkins.forEach(function(c) {
      var checkin = createCheckin(c), location = checkin.location;

      // Check for latitude and longitude
      if(!(location.lat) || !(location.lng)) {
        return;
      }

      // Get the distance between the checkin's location and "home".
      var distance = LatLng.getDistance(home, location);

      // If it's less than the boundary, just return (and discard).
      if(distance[options.distanceUnit] <= options.homeRadius) {
        return;
      }

      // If the current trip has no checkins...
      if(trip.length <= 0) {
        // ...but we already have trips stored...
        if(results.length > 0) {
          // ...check the distance of the last checkin of the last trip...
          if(LatLng.getDistance(_.last(_.last(results).checkins).location, location)[options.distanceUnit] <= options.cityRadius) {
            // ... if it fits, add it to that trip and return...
            _.last(results).push(checkin);
            return;
          }
        }
        // ...otherwise, add it to the current, empty trip.
        trip.push(checkin);
        return;
      }

      // Get the first location of the first checkin in the trip.
      var firstLocation = _.first(trip).location;

      // If the distance between the first location and this checkin's location is within the boundary...
      if(LatLng.getDistance(firstLocation, location)[options.distanceUnit] <= options.cityRadius) {
        // ...add to the trip.
        trip.push(checkin);
      }
      else {
        // ... otherwise, process and add the trip. If the trip length is within the minimum...
        if(trip.length >= options.tripMinimum) {
          // ...increment the qualifying checkins count.
          qualifyingCheckins += trip.length;
          results.push(buildTrip(trip, results.length + 1));
        }
        trip = [checkin];
      }
    });

    if(trip.length >= options.tripMinimum) {
      results.push(buildTrip(trip, results.length + 1));
    }

    logger.info("BUILT: " + results.length + " trips using " + qualifyingCheckins + " of " + checkins.length + " checkins.");

    callback(null, {
      "totalCheckins" : checkins.length,
      "qualifyingCheckings" : qualifyingCheckins,
      "totalTrips" : results.length,
      "home" : home,
      "startDate" : options.after,
      "endDate" : options.before,
      "start" : moment(options.after).format("MMMM D, YYYY"),
      "end" : moment(options.before).format("MMMM D, YYYY"),
      "options" : options,
      "trips" : results
    });
  }

  function retrieveCheckinSet(offset, options, accessToken, callback) {
    logger.debug("ENTERING: retrieveCheckinSet, offset=" + offset);

    Foursquare.Users.getCheckins("self", {
      "limit" : options.limit,
      "beforeTimestamp" : getEpoch(options.before),
      "afterTimestamp" : getEpoch(options.after),
      "offset" : offset
    }, accessToken, function success(error, results) {
      if(error) {
        callback(error);
      }
      else {
        callback(null, results.checkins ? results.checkins.items || [] : []);
      }
    });
  }

  function retrieveCheckins(options, accessToken, callback) {
    logger.debug("ENTERING: getCheckins");

    options = options || {};
    mergeDefaults(options, defaultOptions);

    if(!(options.before instanceof Date)) {
      options.before = new Date();
      logger.debug("Defaulting beforeTimestamp to: " + options.before + ", epoch: " + getEpoch(options.before));
    }

    if(!(options.after instanceof Date)) {
      var a = new Date();
      a.setYear(options.before.getFullYear() - 1);
      options.after = a;
      logger.debug("Defaulting afterTimestamp to: " + options.after + ", epoch: " + getEpoch(options.after));
    }

    var coreOffset = 0,
      queuePass = true,
      passTotal = 0,
      allResults = [];

    async.whilst(
      function() {
        passTotal++;
        return queuePass;
      },
      function(callback) {
        var passes = [],
          rc = function(callback) {
            retrieveCheckinSet(coreOffset, options, accessToken, callback);
            coreOffset += options.limit;
          };
        // TODO: This looks and feels STUPID. Alternative?
        for(var i = 0; i < options.concurrentCalls; i++) {
          passes.push(rc);
        }

        async.parallel(passes, function(error, checkins) {
          if(!error) {
            checkins.forEach(function(checkinSet) {
              queuePass = (checkinSet.length == options.limit);
              allResults = allResults.concat(checkinSet);
            });
          }
          callback(error, checkins);
        });
      }, function(error) {
        logger.info("RETRIEVED: " + allResults.length + " checkins in " + passTotal + " pass(es) of " + options.concurrentCalls + " calls each.");
        if(error) {
          logger.error(error);
          callback(error);
        }
        else {
          callback(null, allResults);
        }
    });
  }

  function retrieveTrips(zip, options, accessToken, callback) {
    logger.debug("ENTERING: getTrips");

    options = options || {};
    mergeDefaults(options, defaultOptions);

    if(!accessToken || !zip) {
      callback({
        "name" : "ObjectRequired",
        "description" : "accessToken and location are required parameters."
      });
    }

    logger.info("RETRIEVING: trips for Zip Code " + zip);

    async.parallel([
      function(callback) {
        LatLng.getLocationByZipCode(zip, callback);
      },
      function(callback) {
        retrieveCheckins(options, accessToken, callback);
      }
    ], function(err, results) {
      if(err) {
       callback(err);
      }
      else {
        var checkins = results[1],
            location = results[0];

        buildTripsByLocation(checkins, location, options, function(error, trips) {
          if(error) {
            callback(error);
          }
          else {
            callback(null, trips, checkins, location);
          }
        });
      }
    });
  }

  return {
    "retrieveCheckins" : retrieveCheckins,
    "retrieveTrips" : retrieveTrips,
    "buildTripsByZip" : buildTripsByZip,
    "buildTripsByLocation" : buildTripsByLocation
  }
};

exports = module.exports = Backstroke;
