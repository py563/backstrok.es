/**
 * @providesModule Trips
 * @flow
 */

import React from 'react';
import cx from 'classnames';

import Header from './Header';
import Nav from './Nav';
import TripForm from './TripForm';
import TripList from './TripList';

import styles from './../../css/trips/index.module.css';

type DefaultProps = {
  data: Object,
};

type Props = DefaultProps & {
  form: Object,
};

export default class Trips extends React.PureComponent<Props, DefaultProps> {
  static defaultProps: DefaultProps = {
    data: {},
  };

  render() {
    const { data, form } = this.props;
    console.log(data);
    const { trips, home, start, end } = data;

    let bodyClass = styles.trips;

    if (!!trips) {
      bodyClass = cx(bodyClass, styles.foundTrips);
    }

    const tripContent = trips ? (
      <TripList home={home} trips={trips} start={start} end={end} />
    ) : (
      <noscript />
    );

    return (
      <div className={bodyClass}>
        <div className={styles.start}>
          <Header />
          <Nav />
          <hr />
          <TripForm {...form} />
        </div>
        <hr />
        {tripContent}
        <script
          type="text/javascript"
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQSxSY9Nk64E3QfLnEatDvfhQRW1p23G0"
        />
      </div>
    );
  }
}
