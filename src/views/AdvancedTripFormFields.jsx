/**
 * @providesModule AdvancedTripFormFields
 * @flow
 */

type Option = {
  value: string,
  selected: boolean,
  text: string,
};

export type FormFields = {
  cityRadius: number,
  endMonths: Array<Option>,
  endYears: Array<Option>,
  homeRadius: number,
  startMonths: Array<Option>,
  startYears: Array<Option>,
  tripMinimum: number,
};

const React = require('react');

function getOptions(options: ?Array<Option>) {
  return options ? (
    options.map(option => (
      <option value={option.value} selected={option.selected ? 'selected' : ''}>
        {option.text}
      </option>
    ))
  ) : (
    <noscript />
  );
}

class AdvancedTripFormFields extends React.PureComponent<FormFields> {
  render() {
    return (
      <fieldset className="fieldset options-fields">
        <legend className="options-hd">
          <span>Options</span>
        </legend>
        <p className="remove-options">
          <a href="/trips">Remove</a>
          <span> Options</span>
        </p>
        <fieldset className="fieldset date-fields">
          <legend className="fields-hd start-date-hd">
            <span>Start Date</span>
          </legend>
          <p className="field month">
            <label className="field-lbl" htmlFor="sm">
              <span className="field-cap">Month</span>
              <select name="sm" id="sm">
                {getOptions(this.props.startMonths)}
              </select>
            </label>
          </p>
          <p className="field year">
            <label className="field-lbl" htmlFor="sy">
              <span className="field-cap">Year</span>
              <select name="sy" id="sy">
                {getOptions(this.props.startYears)}
              </select>
            </label>
          </p>
        </fieldset>
        <fieldset>
          <legend className="fields-hd start-date-hd">
            <span>End Date</span>
          </legend>
          <p className="field month">
            <label className="field-lbl" htmlFor="em">
              <span className="field-cap">Month</span>
              <select name="em" id="em">
                {getOptions(this.props.endMonths)}
              </select>
            </label>
          </p>
          <p className="field year">
            <label className="field-lbl" htmlFor="ey">
              <span className="field-cap">Year</span>
              <select name="ey" id="ey">
                {getOptions(this.props.endYears)}
              </select>
            </label>
          </p>
        </fieldset>
        <p className="field home-radius">
          <label className="field-lbl" htmlFor="hr">
            <span className="field-cap">Home Radius</span>
            <input
              type="text"
              id="hr"
              name="hr"
              size="4"
              value={this.props.homeRadius}
            />
          </label>
        </p>
        <p className="field city-radius">
          <label className="field-lbl" htmlFor="cr">
            <span className="field-cap">City Radius</span>
            <input
              type="text"
              id="cr"
              name="cr"
              size="4"
              value={this.props.cityRadius}
            />
          </label>
        </p>
        <p className="field check-count">
          <label className="field-lbl" htmlFor="tm">
            <span className="field-cap">Min. Check-ins</span>
            <input
              type="text"
              id="tm"
              name="tm"
              size="4"
              value={this.props.tripMinimum}
            />
          </label>
        </p>
        <input type="hidden" name="a" value="1" />
      </fieldset>
    );
  }
}

module.exports = AdvancedTripFormFields;
