/**
 * @providesModule TripList.jsx
 * @flow
 */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var {PropTypes} = React;

var Trip = require('./Trip.jsx');

var TripList = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    home: PropTypes.object.isRequired,
    trips: PropTypes.array,
    start: PropTypes.string,
    end: PropTypes.string,
  },
  render() {
    var trips = this.props.trips;

    var tripLinks = trips ? trips.map((trip) => {
      return (
        <li className="trip-nav-itm" key={trip.number}>
          <a href={'#trip' + trip.number}>
            <span>{trip.city}, {trip.state} ({trip.count})</span>
          </a>
        </li>
      );
    }) : <noscript />;

  var tripSections = trips ? trips.map((trip, count) => {
      return <Trip {...trip} seq={count + 1} key={'trip' + count} />;
    }) : <noscript />;

    return (
      <div className="results">
        <section className="section trip-nav">
          <header className="section-head">
            <hgroup>
              <h2 className="h2 section-hd">
                <a id="tripList">Trips outside <span className="home-city">{this.props.home.loc} ({this.props.home.zip})</span></a>
              </h2>
              <h3 className="from-to">{this.props.start} to {this.props.end}</h3>
            </hgroup>
          </header>
          <ol className="trip-nav-list">
            {tripLinks}
          </ol>
        </section>
        <hr/>
        {tripSections}
      </div>
    );
  }
});

module.exports = TripList;
