/**
 * @providesModule Connections.jsx
 * @flow
 */
var React = require('react');
var {PropTypes} = React;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Connections = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    session: PropTypes.object,
  },
  render() {
    var connections = <noscript />;
    if (this.props.session) {
      var foursquare = this.props.session.foursquare ? <li className="foursquare">Foursquare</li> : <noscript />;
      var twitter = this.props.session.twitter ? <li className="twitter">Twitter</li> : <noscript />;
      connections =
        <div>
          <p className="connected">You are currently signed in to the following services:</p>
          <ul className="service-list">
            {foursquare}
            {twitter}
          </ul>
        </div>;
    }
    return (
      <section className="section connections">
        <header className="section-head">
          <h2 className="h2 sec-hd"><a id="connections">Connections</a></h2>
        </header>
        <hr/>
        <article className="services">
          {connections}
          <p><strong>No data is <em>ever</em> stored <em>anywhere</em></strong>. There is no
          database. Each time you Backstroke, I query the relevant services.</p>
        </article>
      </section>
    );
  }
});

module.exports = Connections;
