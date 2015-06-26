/**
 * @providesModule AdvancedTripFormFields.jsx
 * @flow
 */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

function getOptions(options) {
  return options ? options.map((option) => {
    return <option value={option.value} selected={option.selected ? 'selected' : ''}>{option.text}</option>;
  }) : <noscript />;
}

var AdvancedTripFormFields = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <fieldset className="fieldset options-fields">
        <legend className="options-hd"><span>Options</span></legend>
        <p className="remove-options"><a href="/trips">Remove</a><span> Options</span></p>
        <fieldset className="fieldset date-fields">
          <legend className="fields-hd start-date-hd"><span>Start Date</span></legend>
          <p className="field month"><label className="field-lbl"><span className="field-cap">Month</span>
            <select name="sm" id="sm">
              {getOptions(this.props.startMonths)}
            </select>
          </label></p>
          <p className="field year"><label className="field-lbl"><span className="field-cap">Year</span>
            <select name="sy" id="sy">
              {getOptions(this.props.startYears)}
            </select>
          </label></p>
        </fieldset>
        <fieldset>
          <legend className="fields-hd start-date-hd"><span>End Date</span></legend>
          <p className="field month"><label className="field-lbl"><span className="field-cap">Month</span>
            <select name="em" id="em">
              {getOptions(this.props.endMonths)}
            </select>
          </label></p>
          <p className="field year"><label className="field-lbl"><span className="field-cap">Year</span>
            <select name="ey" id="ey">
              {getOptions(this.props.endYears)}
            </select>
          </label></p>
        </fieldset>
        <p className="field home-radius"><label className="field-lbl"><span className="field-cap">Home Radius</span><input type="text" id="hr" name="hr" size="4" value={this.props.homeRadius} /></label></p>
        <p className="field city-radius"><label className="field-lbl"><span className="field-cap">City Radius</span><input type="text" id="cr" name="cr" size="4" value={this.props.cityRadius} /></label></p>
        <p className="field check-count"><label className="field-lbl"><span className="field-cap">Min. Check-ins</span><input type="text" id="tm" name="tm" size="4" value={this.props.tripMinimum} /></label></p>
        <input type="hidden" name="a" value="1"/>
      </fieldset>
    );
  }
});

module.exports = AdvancedTripFormFields;

/*

<p className="field year"><label className="field-lbl"><span className="field-cap">Year</span><select name="sy" id="sy">
<% form.advanced.startYears.forEach(function(year) { %>
  <option value="<%= year.value %>"<% if(year.selected) { %> selected="selected"<% } %>><%= year.text %></option>
<% }); %>
</select></label></p>
</fieldset>
<fieldset>
<legend className="fields-hd start-date-hd"><span>End Date</span></legend>
<p className="field month"><label className="field-lbl"><span className="field-cap">Month</span><select name="em" id="em">
<% form.advanced.endMonths.forEach(function(month) { %>
  <option value="<%= month.value %>"<% if(month.selected) { %> selected="selected"<% } %>><%= month.text %></option>
<% }); %>
</select></label></p>
<p className="field year"><label className="field-lbl"><span className="field-cap">Year</span><select name="ey" id="ey">
<% form.advanced.endYears.forEach(function(year) { %>
  <option value="<%= year.value %>"<% if(year.selected) { %> selected="selected"<% } %>><%= year.text %></option>
<% }); %>
</select></label></p>
*/
