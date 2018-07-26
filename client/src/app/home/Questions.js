/**
 * @providesModule Questions
 * @flow
 */
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './../../css/home/Questions.module.css';

export default () => (
  <section className="questions">
    <header className={styles.questionsHeader}>
      <h2 className="questionsHeading">
        <a href="#questions">Questions</a>
      </h2>
    </header>
    <hr />
    <article className={styles.facet}>
      <h3 className={styles.facetHeading} id="trips">
        <span className={styles.facetLabel}>Trips</span>
      </h3>
      <p className={styles.facetDesc}>
        I use <a href="http://www.foursquare.com">Foursquare</a> for a number of
        reasons, but one of my favorites is to keep track of places I go when
        I&#39;m in a new city.
      </p>
      <p className={styles.facetDesc}>
        This facet organizes Foursquare check-ins into &#34;trips&#34; of
        sequential check-ins.
      </p>
      <p className={styles.facetGo}>
        <Link className={styles.buttonLabel} to="/trips">
          Backstroke!
        </Link>
      </p>
    </article>
  </section>
);
