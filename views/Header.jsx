/**
 * @providesModule Header.jsx
 * @flow
 */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Header = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <header className="head">
        <h1 className="h1 hd"><span>Backstrok.es</span></h1>
        <p className="tagline">Answering questions about our Social Media footprints.</p>
      </header>
    );
  }
});

module.exports = Header;
