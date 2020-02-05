/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import Time from './../../../utils/time';
import startCase from 'lodash/startCase';

export default class DateTimeInterval extends React.Component {

  get interval_text() {
    return startCase(this.props.range) ||
      Time.formatTimeRange(this.props.start_time, this.props.end_time);
  }

  render () {
    return (
      <div className={this.props.className}>
        { this.interval_text }
      </div>
    )
  }
}

DateTimeInterval.propTypes = {
  range: PropTypes.string,
  start_time: PropTypes.string,
  end_time: PropTypes.string,
  className: PropTypes.string
};
