/**
 * @providesModule Header
 * @flow
 */
import React from 'react';

import styles from './../../css/home/Header.module.css';

class Header extends React.Component {
  render() {
    return (
      <header className={styles.header}>
        <h1 className={styles.heading}>
          <span>Backstrok.es</span>
        </h1>
        <p className={styles.tagline}>
          Answering questions about our Social Media footprints.
        </p>
      </header>
    );
  }
}

export default Header;
