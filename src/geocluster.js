/* @flow */

// Adapted from https://github.com/yetzt/node-geocluster/

export type Coordinates = {
  lat: number,
  lng: number,
};

export type Location = {
  getCoordinates: () => Coordinates,
};

export type Cluster = {
  centroid: Coordinates,
  radius: {
    length: number,
    km: number,
    miles: number,
  },
  locations: Array<Coordinates>,
};

export type Distance = {
  start: Coordinates,
  end: Coordinates,
  miles: number,
  km: number,
  length: number,
};

/* Converts numeric degrees to radians */
function toRad(number: number): number {
  return number * (Math.PI / 180);
}

const getDistance = (start: Coordinates, end: Coordinates): Distance => {
  /* Props to MoveableType Scripts: http://www.movable-type.co.uk/scripts/latlong.html */
  const radius = 6371;
  const dLat = toRad(end.lat - start.lat);
  const dLon = toRad(end.lng - start.lng);

  const angle =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(start.lat)) *
      Math.cos(toRad(end.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const length = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
  const km = radius * length;
  const miles = km / 1.607;

  return {
    start,
    end,
    miles,
    km,
    length,
  };
};

const findCentroid = (locations: Array<Locations>): Coordinates => {
  const length = locations.length;
  const total = locations.reduce(
    (acc: Coordinates, location: Location) => {
      const coords = location.getCoordinates();
      return { lat: acc.lat + coords.lat, lng: acc.lng + coords.lng };
    },
    { lat: 0, lng: 0 }
  );
  return { lat: total.lat / length, lng: total.lng / length };
};

const getClusters = (locations: Array<Location>, bias?: number = 1) => {
  let totalDistance = 0;
  let distances = [];

  // calculate sum of distances
  for (let i = 1; i < locations.length; i++) {
    const distance = getDistance(
      locations[i].getCoordinates(),
      locations[i - 1].getCoordinates()
    );
    totalDistance += distance.length;
    distances.push(distance);
  }

  // calculate mean distance
  const mean = totalDistance / distances.length;
  let variance = 0;

  // calculate variance total
  distances.forEach((distance: Distance) => {
    variance += Math.pow(distance.length - mean, 2);
  });

  // derive threshold from stdev and bias
  const stdev = Math.sqrt(variance / distances.length);
  const threshold = stdev * bias;

  let clusters: Array<Cluster> = [];

  // loop locations and distribute them to clusters
  let changing = true;

  while (changing === true) {
    let newCluster = false;
    let clusterChanged = false;

    // iterate over locations
    locations.forEach(function(location: Location, locationIndex: number) {
      let closestDistanceLength = Infinity;
      let closestClusterIndex = 0;

      // find closest cluster
      clusters.forEach((cluster: Cluster, clusterIndex: number) => {
        // distance to cluster
        const distance = getDistance(
          location.getCoordinates(),
          cluster.centroid
        );

        if (distance.length < closestDistanceLength) {
          closestDistanceLength = distance.length;
          closestClusterIndex = clusterIndex;
        }
      });

      // is the closest distance smaller than the stddev of locations?
      if (closestDistanceLength < threshold || closestDistanceLength === 0) {
        // put element into existing cluster
        const a = clusters[closestClusterIndex];
        a.locations.push(location);
      } else {
        clusters.push({
          centroid: location.getCoordinates(),
          locations: [location],
          radius: {
            length: 0,
            km: 0,
            miles: 0,
          },
        });
      }
    });

    // delete empty clusters
    clusters = clusters.filter((cluster: Cluster) => {
      return !!cluster.locations && cluster.locations.length > 0;
    });

    // update the clusters' centroids and check for change
    clusters.forEach(function(cluster: Cluster, index: number) {
      const centroid = findCentroid(cluster.locations);

      if (
        centroid.lat !== cluster.centroid.lat ||
        centroid.lng !== cluster.centroid.lng
      ) {
        clusters[index].centroid = centroid;
        clusterChanged = true;
      }
    });

    // loop cycle if clusters have changed
    if (!clusterChanged && !newCluster) {
      changing = false;
    } else {
      // remove all locations from clusters and run again
      if (changing) {
        clusters = clusters.map((cluster: Cluster) => {
          cluster.locations = [];
          return cluster;
        });
      }
    }
  }

  clusters.forEach((cluster: Cluster, index: number) => {
    let furthestDistance = null;

    cluster.locations.forEach(location => {
      const distance = getDistance(cluster.centroid, location.getCoordinates());

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
  getClusters,
};
