declare module 'FoursquareAPI' {
  declare export type FoursquareEntity = {
    id: string,
    firstName: string,
    lastName: string,
    photo: {
      prefix: string,
      suffix: string,
    },
    type: 'user' | 'venue',
  };

  declare export type WhoResponse = Response & {
    foursquare: ?FoursquareEntity,
  };
}
