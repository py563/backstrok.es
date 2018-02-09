/**
 * @providesModule Connections
 * @flow
 */
import React from 'react';

import styles from './../../css/home/Connections.module.css';

type Props = {
  session?: ?{
    foursquare?: ?Object,
    twitter?: ?Object,
  },
};

export default class Connections extends React.PureComponent<Props> {
  render() {
    let connections = <noscript />;

    if (this.props.session) {
      const foursquare = this.props.session.foursquare ? (
        <li className="foursquare">Foursquare</li>
      ) : (
        <noscript />
      );

      const twitter = this.props.session.twitter ? (
        <li className="twitter">Twitter</li>
      ) : (
        <noscript />
      );

      connections = (
        <div>
          <p className="connected">
            You are currently signed in to the following services:
          </p>
          <ul className={styles.serviceList}>
            {foursquare}
            {twitter}
          </ul>
        </div>
      );
    }

    return (
      <section className={styles.connections}>
        <header className={styles.connectionsHeader}>
          <h2 id="connections">Connections</h2>
        </header>
        <hr />
        <article className={styles.services}>
          {connections}
          <p>
            <strong>
              No data is <em>ever</em> stored <em>anywhere</em>
            </strong>. There is no database. Each time you Backstroke, I query
            the relevant services.
          </p>
        </article>
      </section>
    );
  }
}
