/**
 * @providesModule Trips.jsx
 * @flow
 */
var TripForm = require('./TripForm.jsx');
var TripList = require('./TripList.jsx');
var React = require('react');
var cx = require('classnames');

var {PropTypes} = React;

var Trips = React.createClass({
  propTypes: {
    data: PropTypes.object,
    form: PropTypes.object,
  },
  getDefaultProps() {
    return {
      data: {},
    };
  },
  render() {
    var data = this.props.data || {};
    var {trips, home, start, end, form} = data;

    var bodyClass = cx({
      'trips': true,
      'found-trips': !!trips
    });

    var tripContent = trips ?
      <TripList
        home={home}
        trips={trips}
        start={start}
        end={end}
      /> : <noscript />;

    return (
      <html lang="en">
      <head>
        <title>Backstrok.es - Trips</title>
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Arvo:regular,italic,bold,bolditalic" />
        <link rel="stylesheet" href="/css/core.css" />
        <link rel="stylesheet" href="/css/trips.css" />
      </head>
      <body className={bodyClass}>
        <div className="wrapper">
          <div className="start">
            <header className="head">
              <hgroup>
                <h1 className="h1 hd"><a href="/">Backstrok.es</a></h1>
                <h2 className="h2 sub-hd"><span>Trips</span></h2>
              </hgroup>
              <p className="tagline">Organize check-ins into trips to cities outside a "home" ZIP code.</p>
            </header>
            <nav className="nav">
              <p className="nav-home"><a href="/">Home</a></p>
              <p className="nav-logout"><a href="/logout">Logout</a></p>
            </nav>
            <hr/>
            <TripForm {...this.props.form} />
          </div>
          <hr/>
          {tripContent}
        </div>
      <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQSxSY9Nk64E3QfLnEatDvfhQRW1p23G0"></script>
      <script src="/scripts/ender.min.js" type="text/javascript"></script>
      <script src="/scripts/trips.js" type="text/javascript"></script>
      </body>
    </html>
    );
  }
});

module.exports = Trips;
