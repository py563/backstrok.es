/**
 * @providesModule Connections
 * @flow
 */
const React = require('react');

type Props = {
  session?: ?{
    foursquare?: ?Object,
    twitter?: ?Object,
  },
};

class Connections extends React.PureComponent<Props> {
  render() {
    let connections = <noscript />;
    if (this.props.session) {
      const foursquare = this.props.session.foursquare ? (
        <li className="foursquare">Foursquare</li>
      ) : (
        <noscript />
      );
      const twitter = this.props.session.twitter ? (
        <li className="twitter">Twitter</li>
      ) : (
        <noscript />
      );
      connections = (
        <div>
          <p className="connected">
            You are currently signed in to the following services:
          </p>
          <ul className="service-list">
            {foursquare}
            {twitter}
          </ul>
        </div>
      );
    }
    return (
      <section className="section connections">
        <header className="section-head">
          <h2 className="h2 sec-hd" id="connections">
            Connections
          </h2>
        </header>
        <hr />
        <article className="services">
          {connections}
          <p>
            <strong>
              No data is <em>ever</em> stored <em>anywhere</em>
            </strong>. There is no database. Each time you Backstroke, I query
            the relevant services.
          </p>
        </article>
      </section>
    );
  }
}

module.exports = Connections;
