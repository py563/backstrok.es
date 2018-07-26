/* @flow */
import relativeDate from 'relative-date';
import moment from 'moment';

import type { FoursquareUser } from './routes/auth';

export type FoursquarePhoto = {
  id: string,
  createdAt: number,
  source: {
    name: string,
    url: string,
  },
  prefix: string,
  suffix: string,
  width: number,
  height: number,
  demoted: boolean,
  user: FoursquareUser,
  visibility: string,
};

export type FoursquareCategory = {
  icon: {
    prefix: string,
    suffix: string,
  },
  id: string,
  name: string,
  pluralName: string,
  primary: boolean,
  shortName: string,
};

export type FoursquareVenue = {
  categories: Array<FoursquareCategory>,
  location: {
    city: string,
    crossStreet: string,
    lat: string,
    lng: string,
    postalCode: string,
    state: string,
    street: string,
  },
  name: string,
  verified: boolean,
  stats: {
    tipCount: number,
    usersCount: number,
    checkinsCount: number,
  },
  delivery: {
    id: string,
    url: string,
    provider: {
      name: string,
      icon: {
        prefix: string,
        sizes: Array<number>,
        name: string,
      },
    },
  },
  allowMenuUrlEdit: boolean,
  beenHere: { lastCheckinExpiredAt: number },
};

export type FoursquareCheckin = {
  createdAt: number,
  comments: {
    count: number,
  },
  id: string,
  photos: {
    count: number,
    items: Array<FoursquarePhoto>,
  },
  layout: {
    name: string,
  },
  shout: string,
  timeZoneOffset: number,
  venue: FoursquareVenue,
};

export type BackstrokesCheckin = Location & {
  categories: Array<FoursquareCategory>,
  city: string,
  created: Date,
  createdDate: string,
  createdEpoch: number,
  createdSince: string,
  createdTime: string,
  crossStreet: string,
  id: string,
  location: {
    lat: string,
    lng: string,
  },
  name: string,
  photos: Array<FoursquarePhoto>,
  postalCode: string,
  shout: string,
  state: string,
  street: string,
  venue: {
    verified: boolean,
    stats: {
      tipCount: number,
      usersCount: number,
      checkinsCount: number,
    },
    beenHere: { lastCheckinExpiredAt: number },
  },
};

export const comparator = (o1: FoursquareCheckin, o2: FoursquareCheckin) => {
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

export const toBackstrokesCheckin = (
  checkin: FoursquareCheckin
): BackstrokesCheckin => {
  const { createdAt, id, photos, shout, timeZoneOffset, venue } = checkin;
  const { categories, location, name, verified, stats, beenHere } = venue;
  const { city, crossStreet, lat, lng, postalCode, state, street } = location;
  const d = moment.unix(createdAt).utcOffset(timeZoneOffset);

  return {
    categories,
    city,
    created: d.toDate(),
    createdDate: moment(d).format('ddd, MMM Do, YYYY'),
    createdEpoch: createdAt,
    createdSince: relativeDate(d.toDate()),
    createdTime: moment(d).format('h:mma'),
    crossStreet,
    id,
    location: {
      lat,
      lng,
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
      beenHere,
    },
    getCoordinates: () => {
      return {
        lat,
        lng,
      };
    },
  };
};

export default {
  comparator,
  toBackstrokesCheckin,
};
