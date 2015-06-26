/**
 * @providesModule Trip.jsx
 * @flow
 */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Checkin = require('./Checkin.jsx');

var {PropTypes} = React;

var Trip = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    seq: PropTypes.number,
    city: PropTypes.string,
    state: PropTypes.string,
    count: PropTypes.number,
    range: PropTypes.string,
    checkins: PropTypes.array,
  },
  render() {

    var checkins = this.props.checkins ? this.props.checkins.map((checkin, count) => {
      return <Checkin {...checkin} seq={count} />;
    }) : <noscript />;

    return (
      <section className="section trip-items">
        <header className="section-head">
          <hgroup>
            <h2 className="h2 trip-item-hd"><a id={'trip' + this.props.seq}>{this.props.city}, {this.props.state}</a></h2>
            <hr/>
            <h3 className="h3 trip-details-hd">Trip Details</h3>
          </hgroup>
          <dl className="trip-details">
            <dt className="trip-det-ttl count"><span>Check-in Count</span></dt>
            <dd className="trip-det-det count"><span>{this.props.count}</span></dd>
            <dt className="trip-det-ttl date-range"><span>Date Range</span></dt>
            <dd className="trip-det-det date-range"><span>{this.props.range}</span></dd>
          </dl>
        </header>
        <h3 className="h3 checkins-hd">Check-ins</h3>
        {checkins}
        <p className="btt"><a href="#">Back to Top</a></p>
      </section>
    );
  }
});

module.exports = Trip;
