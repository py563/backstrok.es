/**
 * @providesModule TripList
 * @flow
 */

import type {Trip} from './TripRow';

const React = require('react');

const TripRow = require('./TripRow');

type Props = {
  end: string,
  home: {
    loc: string,
    zip: string,
  },
  start: string,
  trips: Array<Trip>,
};

class TripList extends React.PureComponent<Props> {
  render() {
    const {end, home, start, trips} = this.props;

    const tripLinks = trips ? (
      trips.map(trip => (
        <li className="trip-nav-itm" key={trip.number}>
          <a href={`#trip${trip.number}`}>
            <span>
              {trip.city}, {trip.state} ({trip.count})
            </span>
          </a>
        </li>
      ))
    ) : (
      <noscript />
    );

    const tripSections = trips ? (
      trips.map((trip, count) => (
        <TripRow {...trip} seq={count + 1} key={trip.number} />
      ))
    ) : (
      <noscript />
    );

    return (
      <div className="results">
        <section className="section trip-nav">
          <header className="section-head">
            <hgroup>
              <h2 className="h2 section-hd" id="tripList">
                Trips outside{' '}
                <span className="home-city">
                  {home.loc} ({home.zip})
                </span>
              </h2>
              <h3 className="from-to">
                {start} to {end}
              </h3>
            </hgroup>
          </header>
          <ol className="trip-nav-list">{tripLinks}</ol>
        </section>
        <hr />
        {tripSections}
      </div>
    );
  }
}

module.exports = TripList;
