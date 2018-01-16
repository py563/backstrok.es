/**
 * @providesModule Nav
 * @flow
 */
import React from 'react';

import styles from './../../css/home/Nav.module.css';

export default () => (
  <nav className={styles.list}>
    <ol>
      <li>
        <a href="#questions">Questions</a>
        <ol>
          <li>
            <a href="#trips">Trips</a>
          </li>
          <li>
            <a href="#tripstweets">Trips n&#39; Tweets</a>
          </li>
        </ol>
      </li>
      <li>
        <a href="#connections">Connections</a>
      </li>
      <li>
        <a href="#about">About</a>
      </li>
    </ol>
  </nav>
);
