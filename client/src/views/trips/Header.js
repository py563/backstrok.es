/**
 * @providesModule Header
 * @flow
 */

import React from 'react';
import styles from './../../css/trips/Header.module.css';

export default () => (
  <header className="head">
    <hgroup>
      <h1 className={styles.header}>
        <a href="/">Backstrok.es</a>
      </h1>
      <h2 className={styles.subHeader}>
        <span>Trips</span>
      </h2>
    </hgroup>
    <p className={styles.tagline}>
      Organize check-ins into trips to cities outside a &#34;home&#34; ZIP code.
    </p>
  </header>
);
