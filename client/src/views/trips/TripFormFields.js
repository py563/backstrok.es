/**
 * @providesModule TripFormFields
 * @flow
 */

import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import { Link } from 'react-router-dom';
import styles from './../../css/trips/TripFormFields.module.css';

type Option = {
  value: string,
  text: string,
};

type DefaultProps = {
  cityRadius: number,
  endMonth: number,
  endYear: number,
  homeRadius: number,
  startMonth: number,
  startYear: number,
  startedYear: number,
  tripMinimum: number,
};

export type Props = DefaultProps;

function getOptions(options: ?Array<Option>) {
  return options
    ? options.map(option => (
        <option key={option.text} value={option.value}>
          {option.text}
        </option>
      ))
    : null;
}

const currentMonth = moment().month() + 1;
const currentYear = moment().year();
const months = getOptions(
  moment.months().map((_, value) => {
    const display = value + 1;
    return {
      text: display,
      value: display,
    };
  }),
);

export default class TripFormFields extends React.PureComponent<
  DefaultProps,
  Props,
> {
  static defaultProps: DefaultProps = {
    cityRadius: 20,
    endMonth: currentMonth,
    endYear: currentYear,
    homeRadius: 50,
    startMonth: currentMonth,
    startYear: currentYear - 1,
    startedYear: 2009,
    tripMinimum: 2,
  };

  render() {
    const {
      cityRadius,
      endMonth,
      endYear,
      homeRadius,
      startedYear,
      startMonth,
      startYear,
      tripMinimum,
    } = this.props;

    const years = getOptions(
      [...Array(currentYear - startedYear + 1)].map((_, i) => {
        const year = currentYear - i;
        return {
          text: year,
          value: year,
        };
      }),
    );

    return (
      <fieldset className={styles.fields}>
        <legend className={styles.hidden}>
          <span>Options</span>
        </legend>
        <p className={styles.removeOptions}>
          <Link to="/trips">Remove</Link>
          <span> Options</span>
        </p>
        <fieldset>
          <legend className={styles.fieldHeader}>
            <span>Start Date</span>
          </legend>
          <p className={cx(styles.field, styles.month)} key="startMonth">
            <label htmlFor="sm">
              <span className={styles.hidden}>Month</span>
              <select name="sm" id="sm" defaultValue={startMonth}>
                {months}
              </select>
            </label>
          </p>
          <p className={cx(styles.field, styles.year)} key="startYear">
            <label htmlFor="sy">
              <span className={styles.hidden}>Year</span>
              <select name="sy" id="sy" defaultValue={startYear}>
                {years}
              </select>
            </label>
          </p>
        </fieldset>
        <fieldset>
          <legend className={styles.fieldHeader}>
            <span>End Date</span>
          </legend>
          <p className={cx(styles.field, styles.month)} key="endMonth">
            <label htmlFor="em">
              <span className={styles.hidden}>Month</span>
              <select name="em" id="em" defaultValue={endMonth}>
                {months}
              </select>
            </label>
          </p>
          <p className={cx(styles.field, styles.year)} key="endYear">
            <label htmlFor="ey">
              <span className={styles.hidden}>Year</span>
              <select name="ey" id="ey" defaultValue={endYear}>
                {years}
              </select>
            </label>
          </p>
        </fieldset>
        <p className={styles.field} hey="homeRadius">
          <label htmlFor="hr">
            <span className={styles.fieldCaption}>Home Radius</span>
            <input
              type="text"
              id="hr"
              name="hr"
              size="4"
              defaultValue={homeRadius}
            />
          </label>
        </p>
        <p className={styles.field} key="cityRadius">
          <label htmlFor="cr">
            <span className={styles.fieldCaption}>City Radius</span>
            <input
              type="text"
              id="cr"
              name="cr"
              size="4"
              defaultValue={cityRadius}
            />
          </label>
        </p>
        <p className={styles.field} key="tripMinimum">
          <label htmlFor="tm">
            <span className={styles.fieldCaption}>Min. Check-ins</span>
            <input
              type="text"
              id="tm"
              name="tm"
              size="4"
              defaultValue={tripMinimum}
            />
          </label>
        </p>
      </fieldset>
    );
  }
}
