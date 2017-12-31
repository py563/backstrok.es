/**
 * @providesModule Trips
 * @flow
 */
const TripForm = require('./TripForm');
const TripList = require('./TripList');
const React = require('react');
const cx = require('classnames');

type DefaultProps = {
  data: Object,
};

type Props = DefaultProps & {
  form: Object,
};

class Trips extends React.PureComponent<Props, DefaultProps> {
  static defaultProps: DefaultProps = {
    data: {},
  };

  render() {
    const {data, form} = this.props;
    console.log(data);
    const {trips, home, start, end} = data;

    const bodyClass = cx({
      trips: true,
      'found-trips': !!trips,
    });

    const tripContent = trips ? (
      <TripList home={home} trips={trips} start={start} end={end} />
    ) : (
      <noscript />
    );

    return (
      <html lang="en">
        <head>
          <title>Backstrok.es - Trips</title>
          <link
            rel="stylesheet"
            href="http://fonts.googleapis.com/css?family=Arvo:regular,italic,bold,bolditalic"
          />
          <link rel="stylesheet" href="/css/core.css" />
          <link rel="stylesheet" href="/css/trips.css" />
        </head>
        <body className={bodyClass}>
          <div className="wrapper">
            <div className="start">
              <header className="head">
                <hgroup>
                  <h1 className="h1 hd">
                    <a href="/">Backstrok.es</a>
                  </h1>
                  <h2 className="h2 sub-hd">
                    <span>Trips</span>
                  </h2>
                </hgroup>
                <p className="tagline">
                  Organize check-ins into trips to cities outside a
                  &#34;home&#34; ZIP code.
                </p>
              </header>
              <nav className="nav">
                <p className="nav-home">
                  <a href="/">Home</a>
                </p>
                <p className="nav-logout">
                  <a href="/logout">Logout</a>
                </p>
              </nav>
              <hr />
              <TripForm {...form} />
            </div>
            <hr />
            {tripContent}
          </div>
          <script
            type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQSxSY9Nk64E3QfLnEatDvfhQRW1p23G0"
          />
          <script src="/scripts/ender.min.js" type="text/javascript" />
          <script src="/scripts/trips.js" type="text/javascript" />
        </body>
      </html>
    );
  }
}

module.exports = Trips;
