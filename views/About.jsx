/**
 * @providesModule About.jsx
 * @flow
 */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var About = React.createClass({
  mixins: [PureRenderMixin],
  _onButtonClick: function() {
    alert('I was rendered on server side but I am clickable because of client mounting!');
  },
  render() {
    return (
      <section className="section about">
        <header className="section-head">
          <h2 className="h2 sec-hd"><a id="about">About</a></h2>
        </header>
        <hr/>
        <p className="hi">Hi, I'm <a href="http://www.clintandrewhall.com/">Clint</a>. I use the cloud.</p>
        <p>This is a collection of answers to questions I've asked about my data that the
        services I use don't necessarily answer.</p>
        <p>Give it try! Do you have <a href="mailto:feedback@backstrok.es">feedback</a> or <a href="mailto:questions@backstroke.es">questions</a> you'd want answered?</p>
      </section>
    );
  }
});

module.exports = About;
