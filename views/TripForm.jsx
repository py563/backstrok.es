/**
 * @providesModule TripForm.jsx
 * @flow
 */
var AdvancedTripFormFields = require('./AdvancedTripFormFields.jsx');

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var {PropTypes} = React;

var TripForm = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    zip: PropTypes.string,
    advanced: PropTypes.bool,
    startMonths: PropTypes.array,
    startYears: PropTypes.array,
    endMonths: PropTypes.array,
    endYears: PropTypes.array,
    homeRadius: PropTypes.number,
    cityRadius: PropTypes.number,
    tripMinimum: PropTypes.number,
  },
  getDefaultProps() {
    return {
      advanced: false,
    }
  },
  render() {
    var content;
    if (!this.props.advanced) {
      content = <p className="options"><a href="/trips?a=1">Options</a></p>;
    } else {
      content = <AdvancedTripFormFields {...this.props} {...this.props.advanced} />;
    }

    return (
      <section className="section params">
        <form action="/trips" method="get" className="form trip-form">
          <p className="field zip"><label className="field-lbl"><span className="field-cap">Zip Code</span><input type="text" id="zip" name="zip" value={this.props.zip} /></label></p>
          {content}
          <p className="button submit"><input type="submit" value="Submit"/></p>
        </form>
      </section>
    );
  }
});

module.exports = TripForm;
