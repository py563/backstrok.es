/**
 * @providesModule TripRow
 * @flow
 */
import type {Checkin} from './CheckinRow';

const React = require('react');

const CheckinRow = require('./CheckinRow');

export type Trip = {
  checkins: ?Array<Checkin>,
  city: string,
  count: number,
  number: number,
  range: string,
  seq: number,
  state: string,
};

class TripRow extends React.PureComponent<Trip> {
  render() {
    const {checkins, city, count, range, seq, state} = this.props;
    const checkinFields = checkins ? (
      checkins.map((checkin, total) => <CheckinRow {...checkin} seq={total} />)
    ) : (
      <noscript />
    );

    return (
      <section className="section trip-items">
        <header className="section-head">
          <hgroup>
            <h2 className="h2 trip-item-hd" id={`trip${seq}`}>
              {city}, {state}
            </h2>
            <hr />
            <h3 className="h3 trip-details-hd">Trip Details</h3>
          </hgroup>
          <dl className="trip-details">
            <dt className="trip-det-ttl count">
              <span>Check-in Count</span>
            </dt>
            <dd className="trip-det-det count">
              <span>{count}</span>
            </dd>
            <dt className="trip-det-ttl date-range">
              <span>Date Range</span>
            </dt>
            <dd className="trip-det-det date-range">
              <span>{range}</span>
            </dd>
          </dl>
        </header>
        <h3 className="h3 checkins-hd">Check-ins</h3>
        {checkinFields}
        <p className="btt">
          <a href="#top">Back to Top</a>
        </p>
      </section>
    );
  }
}

module.exports = TripRow;
