/**
 * @providesModule TripForm.jsx
 * @flow
 */
import type {FormFields} from './AdvancedTripFormFields';

const AdvancedTripFormFields = require('./AdvancedTripFormFields');

const React = require('react');

type DefaultProps = {
  advanced: boolean,
};

type Props = DefaultProps &
  FormFields & {
    zip: string,
  };

class TripForm extends React.PureComponent<Props, DefaultProps> {
  static defaultProps: DefaultProps = {
    advanced: false,
  };

  render() {
    const {advanced, zip} = this.props;

    let content = (
      <p className="options">
        <a href="/trips?a=1">Options</a>
      </p>
    );
    if (advanced) {
      content = <AdvancedTripFormFields {...this.props} />;
    }

    return (
      <section className="section params">
        <form action="/trips" method="get" className="form trip-form">
          <p className="field zip">
            <label className="field-lbl" htmlFor="zip">
              <span className="field-cap">Zip Code</span>
              <input type="text" id="zip" name="zip" value={zip} />
            </label>
          </p>
          {content}
          <p className="button submit">
            <input type="submit" value="Submit" />
          </p>
        </form>
      </section>
    );
  }
}

module.exports = TripForm;
