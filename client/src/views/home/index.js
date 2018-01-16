/**
 * @providesModule Home
 * @flow
 */

import React from 'react';

import About from './About';
import Connections from './Connections';
import Header from './Header';
import Nav from './Nav';
import Questions from './Questions';

import styles from './../../css/home/index.module.css';

type Props = {
  session?: ?{
    foursquare?: ?Object,
    twitter?: ?Object,
  },
};

class Home extends React.PureComponent<Props> {
  render() {
    return (
      <div className={styles.home}>
        <div className={styles.wrapper}>
          <Header />
          <Nav />
          <hr />
          <Questions />
          <Connections session={this.props.session} />
          <About />
        </div>
      </div>
    );
  }
}

export default Home;
