/**
 * @providesModule Questions.jsx
 * @flow
 */
const React = require('react');

module.exports = () => (
  <section className="section questions">
    <header className="section-head">
      <h2 className="h2 sec-hd">
        <a href="#questions">Questions</a>
      </h2>
    </header>
    <hr />
    <article className="facet trips">
      <h3 className="h3 facet-hd" id="#trips">
        Trips
      </h3>
      <p className="desc facet-desc">
        I use <a href="http://www.foursquare.com">Foursquare</a> for a number of
        reasons, but one of my favorites is to keep track of places I go when
        I&#39;m in a new city.
      </p>
      <p className="desc facet-desc">
        This facet organizes Foursquare check-ins into &#34;trips&#34; of
        sequential check-ins that took place outside a &#34;home&#34; ZIP code.
      </p>
      <p className="button facet-go">
        <a href="/trips">Backstroke!</a>
      </p>
    </article>
    <article className="facet tripstweets">
      <h3 className="h3 facet-hd" id="tripstweets">
        Trips n&#39; Tweets
      </h3>
      <p className="desc facet-desc">
        This facet explores where you go and and also what you say. This one is
        currently baking.
      </p>
      <p className="button facet-go">Coming Soon</p>
    </article>
  </section>
);
