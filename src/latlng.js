
var sys = require("util"),
  http = require("http"),
  zipCache = [];

/* Converts numeric degrees to radians */
if(!Number.prototype.toRad) {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

var LatLng = function(config) {
  var logger = require('winston');

  function performRequest(host, url, handler, options) {
    var connection = http.createClient(80, host);
    options = {
      "host" : host,
      "User-Agent": "NodeJS HTTP Client"
    };
    var request = connection.request('GET', url, options);

    request.addListener("response", function(response) {
      var responseBody = "";
      response.setEncoding("utf8");
      response.addListener("data", function(chunk) {
        responseBody += chunk
      });
      response.addListener("end", function() {
        handler(null, responseBody);
      });
      response.addListener("error", function(error) {
        handler(error);
      });
    });
    request.on("error", function(error) {
      logger.error("Error calling remote host: " + error.message);
      handler(error);
    });
    request.end();
  }

  function getLocationByZipCode(zip, callback) {
    if(zipCache[zip]) {
      logger.info("RETRIEVED: " + zip + " from cache: " + sys.inspect(zipCache[zip]));
      callback(null, zipCache[zip]);
    }
    else {
      logger.info("RETRIEVING: Location data for " + zip + " from service.");
      /*var url = "http://where.yahooapis.com/geocode?country=USA&flags=j&appId=" + config.yahoo.appId + "&postal=" + zip,
          host = "where.yahooapis.com";*/
      var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20postal%3D%22" + encodeURI(zip) + "%22&format=json",
          host = "query.yahooapis.com";
      performRequest(host, url, function(error, result) {
        if(error) {
          callback(error);
        }
        else {
          try {
            result = JSON.parse(result).query.results.Result;
          }
          catch(e) {
            callback({
                  "name" : "RuntimeError",
                  "description" : "There was an error parsing the response from Yahoo Geocoding based on the zip code" + zip,
                  "details" : result,
                  "error" : e
                });
            return;
          }

          if(result.Error && results.Error > 0) {
            callback({
                  "name" : "RuntimeError",
                  "description" : "Yahoo returned an error: " + result.Error + " - " + result.ErrorMessage,
                  "details" : result
                });
            return;
          }

          if(result.Found && result.Found <= 0) {
            callback({
                  "name" : "RuntimeError",
                  "description" : "No results were returned with zip code: " + zip,
                  "details" : result
                });
            return;
          }
            /*var loc = /<location>((?:,|\w|\s?)+)<\/location>/g.exec(result),
              lat = /<latitude>(-?\d+\.\d+)<\/latitude>/g.exec(result),
              lng = /<longitude>(-?\d+\.\d+)<\/longitude>/g.exec(result),*/
          var item = result,
              lat = item.latitude,
              lng = item.longitude,
              loc = item.city + ", " + item.statecode,
              entry = {
                "zip" : zip,
                "loc" : (loc && loc.length > 0) ? loc : "",
                "lat" : (lat && lat.length > 0) ? (lat * 1) : null,
                "lng" : (lng && lng.length > 0) ? (lng * 1) : null
              };
          if(!entry.lat || !entry.lng) {
            logger.error("Zip code " + zip + " did not return valid results.");
            logger.debug("Created: " + sys.inspect(entry) + " From: " + sys.inspect(result));
            callback({
              "name" : "RuntimeError",
              "description" : "The specified zip code " + zip + " either did not resolve to a valid location, or there was " +
                  "an error in the Yahoo service.",
              "details" : result
            });
          }
          else {
            logger.info("RETRIEVED: " + entry.loc + " for ZIP code " + zip);
            zipCache[zip] = entry;
            callback(null, entry);
          }
        }
      }, null);
    }
  }

  function getDistance(start, end) {
    /* Props to MoveableType Scripts: http://www.movable-type.co.uk/scripts/latlong.html */
    var radius = 6371,
      dLat = (end.lat - start.lat).toRad(),
      dLon = (end.lng - start.lng).toRad(),
      a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(start.lat.toRad()) * Math.cos(end.lat.toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2),
      km = radius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))),
      m = km / 1.607;
    return {
      "start" : start,
      "end" : end,
      "miles" : m,
      "km" : km
    }
  }

  return {
    "getDistance" : getDistance,
    "getLocationByZipCode" : getLocationByZipCode
  }
};

exports = module.exports = LatLng;
