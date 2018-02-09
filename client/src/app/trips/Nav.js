/**
 * @providesModule Nav
 * @flow
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './../../css/trips/Nav.module.css';

export default () => (
  <nav className={styles.nav}>
    <p className={styles.navHome}>
      <Link to="/">Home</Link>
    </p>
    <p className={styles.navLogout}>
      <Link to="/logout">Logout</Link>
    </p>
  </nav>
);
