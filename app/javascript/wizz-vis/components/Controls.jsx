/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import MenuRange from './controls/MenuRange';

export default class Controls extends React.Component {
  constructor(props){
    super(props);
  }

  get edit_dashboard_url() {
    return `/dashboards/${this.props.dashboard_id}/edit`;
  }

  render() {
    return(
      <div className="dashboard-controls right">
        <div className="controls-entry col">
          <MenuRange id={this.props.dashboard_id} />
        </div>
        <div className='controls-entry col hide-on-small-only'>
          <a href="#" id='fsBtn'>
            <i className="material-icons">fullscreen</i>
          </a>
        </div>
        <div className='controls-entry col'>
          <a href={this.edit_dashboard_url}>
            <i className="material-icons">edit</i>
          </a>
        </div>
      </div>
    );
  }
}
