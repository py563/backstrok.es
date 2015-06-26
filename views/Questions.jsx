/**
 * @providesModule Questions.jsx
 * @flow
 */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Questions = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <section className="section questions">
        <header className="section-head">
          <h2 className="h2 sec-hd"><a id="questions">Questions</a></h2>
        </header>
        <hr/>
        <article className="facet trips">
          <h3 className="h3 facet-hd"><a id="trips">Trips</a></h3>
          <p className="desc facet-desc">
             I use <a href="http://www.foursquare.com">Foursquare</a> for a number of reasons, but one of my favorites is
             to keep track of places I go when I'm in a new city.
          </p>
          <p className="desc facet-desc">
             This facet organizes Foursquare check-ins into "trips" of sequential check-ins that took place
             outside a "home" ZIP code.
          </p>
          <p className="button facet-go"><a href="/trips">Backstroke!</a></p>
        </article>
        <article className="facet tripstweets">
          <h3 className="h3 facet-hd"><a id="tripstweets">Trips n' Tweets</a></h3>
          <p className="desc facet-desc">
             This facet explores where you go and and also what you say.  This one is currently baking.
          </p>
          <p className="button facet-go"><a href="#">Coming Soon</a></p>
        </article>
      </section>
    );
  }
});

module.exports = Questions;
