var sys = require('util'),
  https = require('https'),
  zipCache = [];

/* Converts numeric degrees to radians */
if (!Number.prototype.toRad) {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

var LatLng = function(config) {
  var logger = require('winston');

  function performRequest(url, handler, options) {
    console.log(url);
    https
      .get(url, resp => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          console.log(data);
          handler(null, data);
        });
      })
      .on('error', err => {
        logger.error('Error calling remote host: ' + error.message);
        console.log(error.message);
        handler(error);
      });
  }

  function getLocationByZipCode(zip, callback) {
    if (zipCache[zip]) {
      logger.info(
        'RETRIEVED: ' + zip + ' from cache: ' + sys.inspect(zipCache[zip]),
      );
      callback(null, zipCache[zip]);
    } else {
      logger.info('RETRIEVING: Location data for ' + zip + ' from service.');
      var url =
        'https://www.zipcodeapi.com/rest/' +
        config.zip.api +
        '/info.json/' +
        zip +
        '/degrees';

      performRequest(
        url,
        function(error, result) {
          if (error) {
            callback(error);
          } else {
            try {
              result = JSON.parse(result);
            } catch (e) {
              callback({
                name: 'RuntimeError',
                description:
                  'There was an error parsing the response from the zipcode service based on the zip code' +
                  zip,
                details: result,
                error: e,
              });
              return;
            }

            /*var loc = /<location>((?:,|\w|\s?)+)<\/location>/g.exec(result),
              lat = /<latitude>(-?\d+\.\d+)<\/latitude>/g.exec(result),
              lng = /<longitude>(-?\d+\.\d+)<\/longitude>/g.exec(result),*/
            var item = result,
              lat = item.lat,
              lng = item.lng,
              loc = item.city + ', ' + item.state,
              entry = {
                zip: zip,
                loc: loc && loc.length > 0 ? loc : '',
                lat: lat,
                lng: lng,
              };
            if (!entry.lat || !entry.lng) {
              logger.error(
                'Zip code ' + zip + ' did not return valid results.',
              );
              logger.debug(
                'Created: ' +
                  sys.inspect(entry) +
                  ' From: ' +
                  sys.inspect(result),
              );
              callback({
                name: 'RuntimeError',
                description:
                  'The specified zip code ' +
                  zip +
                  ' either did not resolve to a valid location, or there was ' +
                  'an error in the zipcode service.',
                details: result,
              });
            } else {
              logger.info('RETRIEVED: ' + entry.loc + ' for ZIP code ' + zip);
              zipCache[zip] = entry;
              callback(null, entry);
            }
          }
        },
        null,
      );
    }
  }

  function getDistance(start, end) {
    /* Props to MoveableType Scripts: http://www.movable-type.co.uk/scripts/latlong.html */
    var radius = 6371,
      dLat = (end.lat - start.lat).toRad(),
      dLon = (end.lng - start.lng).toRad(),
      a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(start.lat.toRad()) *
          Math.cos(end.lat.toRad()) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2),
      km = radius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))),
      m = km / 1.607;
    return {
      start: start,
      end: end,
      miles: m,
      km: km,
    };
  }

  return {
    getDistance: getDistance,
    getLocationByZipCode: getLocationByZipCode,
  };
};

exports = module.exports = LatLng;
