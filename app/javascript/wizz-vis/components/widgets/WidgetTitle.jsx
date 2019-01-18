/* jshint esversion: 6 */

import React, { Component } from 'react';
import Drilldown from './utils/Drilldown';
import Refresh from './utils/Refresh';
import Trash from './utils/Trash';
import IntervalInfo from './utils/IntervalInfo';
import cs from 'classnames';
import PropTypes from 'prop-types';

export default class WidgetTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  get haveLinks(){
    return this.props.links !== undefined;
  }

  get isLocked() {
    return this.props.locked;
  }

  render () {
    const cssClass = cs(
      'widget-title',
      {
        'locked': this.isLocked
      }
    );

    const { overrideInterval, showOverrideInterval } = this.props;

    return (
      <div className={ cssClass }>
        {
          this.haveLinks ?
            <Drilldown widget_id={this.props.widget_id} links={this.props.links} /> :
            null
        }
        <div className='title_text'>{ this.props.title }</div>
        <div className='options right'>
          <Refresh widget_id={this.props.widget_id} />
          {
            overrideInterval && showOverrideInterval ?
              <IntervalInfo intervalAttributes={this.props.intervalAttributes} /> :
              null
          }
          <Trash remove={this.props.remove} isLocked={this.props.locked} />
        </div>
      </div>
    )
  }
};

Title.propTypes = {
  title: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string
    })
  ),
  locked: PropTypes.bool,
  remove: PropTypes.func,
  overrideInterval: PropTypes.bool,
  showOverrideInterval: PropTypes.bool,
  intervalAttributes: PropTypes.shape({
    range: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string
  })
};

Title.defaultProps = {
  showOverrideInterval: true
};
