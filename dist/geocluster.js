"use strict";

function toRad(number) {
  return number * (Math.PI / 180);
}

var getDistance = function getDistance(start, end) {
  var radius = 6371;
  var dLat = toRad(end.lat - start.lat);
  var dLon = toRad(end.lng - start.lng);

  var angle = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  var length = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
  var km = radius * length;
  var miles = km / 1.607;

  return {
    start,
    end,
    miles,
    km,
    length
  };
};

var findCentroid = function findCentroid(locations) {
  var length = locations.length;
  var total = locations.reduce(function (acc, location) {
    var coords = location.getCoordinates();
    return { lat: acc.lat + coords.lat, lng: acc.lng + coords.lng };
  }, { lat: 0, lng: 0 });
  return { lat: total.lat / length, lng: total.lng / length };
};

var getClusters = function getClusters(locations) {
  var bias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var totalDistance = 0;
  var distances = [];

  for (var i = 1; i < locations.length; i++) {
    var distance = getDistance(locations[i].getCoordinates(), locations[i - 1].getCoordinates());
    totalDistance += distance.length;
    distances.push(distance);
  }

  var mean = totalDistance / distances.length;
  var variance = 0;

  distances.forEach(function (distance) {
    variance += Math.pow(distance.length - mean, 2);
  });

  var stdev = Math.sqrt(variance / distances.length);
  var threshold = stdev * bias;

  var clusters = [];

  var changing = true;

  while (changing === true) {
    var newCluster = false;
    var clusterChanged = false;

    locations.forEach(function (location, locationIndex) {
      var closestDistanceLength = Infinity;
      var closestClusterIndex = 0;

      clusters.forEach(function (cluster, clusterIndex) {
        var distance = getDistance(location.getCoordinates(), cluster.centroid);

        if (distance.length < closestDistanceLength) {
          closestDistanceLength = distance.length;
          closestClusterIndex = clusterIndex;
        }
      });

      if (closestDistanceLength < threshold || closestDistanceLength === 0) {
        var a = clusters[closestClusterIndex];
        a.locations.push(location);
      } else {
        clusters.push({
          centroid: location.getCoordinates(),
          locations: [location],
          radius: {
            length: 0,
            km: 0,
            miles: 0
          }
        });
      }
    });

    clusters = clusters.filter(function (cluster) {
      return !!cluster.locations && cluster.locations.length > 0;
    });

    clusters.forEach(function (cluster, index) {
      var centroid = findCentroid(cluster.locations);

      if (centroid.lat !== cluster.centroid.lat || centroid.lng !== cluster.centroid.lng) {
        clusters[index].centroid = centroid;
        clusterChanged = true;
      }
    });

    if (!clusterChanged && !newCluster) {
      changing = false;
    } else {
      if (changing) {
        clusters = clusters.map(function (cluster) {
          cluster.locations = [];
          return cluster;
        });
      }
    }
  }

  clusters.forEach(function (cluster, index) {
    var furthestDistance = null;

    cluster.locations.forEach(function (location) {
      var distance = getDistance(cluster.centroid, location.getCoordinates());

      if (!furthestDistance || furthestDistance.length < distance.length) {
        furthestDistance = distance;
      }
    });

    cluster.radius = furthestDistance || cluster.radius;
    clusters[index] = cluster;
  });

  return clusters;
};

module.exports = {
  getDistance,
  getClusters
};