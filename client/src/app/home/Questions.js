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
        sequential check-ins that took place outside a &#34;home&#34; ZIP code.
      </p>
      <p className={styles.facetGo}>
        <Link className={styles.buttonLabel} to="/trips">
          Backstroke!
        </Link>
      </p>
    </article>
    <article className={styles.facet}>
      <h3 className={styles.facetHeading} id="tripstweets">
        <span className={styles.facetLabel}>Trips n&#39; Tweets</span>
      </h3>
      <p className={styles.facetDesc}>
        This facet explores where you go and and also what you say. This one is
        currently baking.
      </p>
      <p className={styles.facetGoDisabled}>
        <span className={styles.buttonLabel}>Coming Soon</span>
      </p>
    </article>
  </section>
);
