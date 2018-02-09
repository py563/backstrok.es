/**
 * @providesModule About
 * @flow
 */
import React from 'react';
import styles from './../../css/home/About.module.css';

export default () => (
  <section className={styles.about}>
    <header className={styles.aboutHeader}>
      <h2>
        <a id="about" href="#about">
          About
        </a>
      </h2>
    </header>
    <hr />
    <p>
      Hi, I&#39;m <a href="http://www.clintandrewhall.com/">Clint</a>. I use the
      cloud.
    </p>
    <p>
      This is a collection of answers to questions I&#39;ve asked about my data
      that the services I use don&#39;t necessarily answer.
    </p>
    <p>
      Give it try! Do you have{' '}
      <a href="mailto:feedback@backstrok.es">feedback</a> or{' '}
      <a href="mailto:questions@backstroke.es">questions</a> you&#39;d want
      answered?
    </p>
  </section>
);
