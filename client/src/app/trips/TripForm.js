/**
 * @providesModule TripForm
 * @flow
 */
import type { Props as FormFields } from './TripFormFields';
import { Route, Link } from 'react-router-dom';

import React from 'react';
import TripFormFields from './TripFormFields';
import styles from './../../css/trips/TripForm.module.css';

type Props = FormFields & {
  zip: string,
};

export default class TripForm extends React.Component<Props> {
  render() {
    const { zip } = this.props;

    return (
      <section className={styles.section}>
        <form action="/trips" method="get" className={styles.tripForm}>
          <p className={styles.field}>
            <label htmlFor="zip">
              <span className={styles.fieldCaption}>Postal Code</span>
              <input type="text" id="zip" name="zip" value={zip} />
            </label>
          </p>
          <Route
            exact
            path="/trips"
            render={props => (
              <p className={styles.options}>
                <Link to="/trips/advanced">Options</Link>
              </p>
            )}
          />
          <Route
            exact
            path="/trips/advanced"
            render={props => <TripFormFields {...this.props} />}
          />
          <p className={styles.submit}>
            <input type="submit" value="Submit" />
          </p>
        </form>
      </section>
    );
  }
}
