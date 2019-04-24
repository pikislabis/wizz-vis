/* jshint esversion: 6 */

import React from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import Time from './../../../utils/time';
import startCase from 'lodash/startCase';

export default class IntervalInfo extends React.Component {

  get interval_text() {
    return startCase(this.props.intervalAttributes.range) ||
      Time.formatTimeRange(this.props.intervalAttributes.start_time,
                           this.props.intervalAttributes.end_time);
  }

  render () {
    return (
      <div className="primary-color-text interval_info">
        <i className="material-icons" data-tip data-for='interval-tip'>watch_later_outline</i>
        <ReactTooltip id='interval-tip' delayHide={200} delayShow={300}
          delayUpdate={200} effect="solid">
            <p data-tip>{ this.interval_text }</p>
        </ReactTooltip>
      </div>
    )
  }
}

IntervalInfo.propTypes = {
  intervalAttributes: PropTypes.shape({
    range: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string
  })
};
