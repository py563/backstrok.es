/**
 * @providesModule Home.react
 * @flow
 */

var About = require('./About.jsx');
var Connections = require('./Connections.jsx');
var Header = require('./Header.jsx');
var Nav = require('./Nav.jsx');
var Questions = require('./Questions.jsx');

var React = require('react');
var {PropTypes} = React;

var Home = React.createClass({
  propTypes: {
    session: PropTypes.object,
  },
  render() {
    return (
      <html lang="en">
      <head>
        <title>Backstrok.es</title>
        <meta property="og:title" content="backstrok.es: Answering Questions about our Social Media Footprints" />
        <meta property="og:site_name" content="backstrok.es" />
        <meta property="og:url" content="http://www.backstrok.es" />
        <meta property="og:description" content="I use Foursquare to keep track of places I go when I'm in a new city. This facet organizes Foursquare check-ins into 'trips' of sequential check-ins that took place outside a 'home' ZIP code." />
        <meta property="og:image" content="http://www.backstrok.es/images/logo.png" />
        <meta property="og:type" content="website" />
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Arvo:regular,italic,bold,bolditalic" />
        <link rel="stylesheet" href="/css/core.css" />
        <link rel="stylesheet" href="/css/home.css" />
      </head>
      <body className="home">
        <div className="wrapper">
          <Header />
          <Nav />
          <hr/>
          <Questions />
          <Connections session={this.props.session} />
          <About />
        </div>
      </body>
      </html>
    );
  }
});

module.exports = Home;
