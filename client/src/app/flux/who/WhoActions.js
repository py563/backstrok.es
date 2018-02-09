type HereFoursquare = {
  isHere: boolean,
  who: ?FoursquareEntity,
};

export type WhoAction =
  | {
      type: 'who/start-load',
    }
  | {
      type: 'who/loaded',
      who: Array<string>,
    }
  | {
      type: 'who/load-error',
      error: Error,
    };
