/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import MenuRange from './controls/MenuRange';
import MenuOptions from './controls/MenuOptions';

export default class Controls extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <div className="dashboard-controls">
        <div className="controls-entry col flex-5 center">
          <MenuRange id={this.props.dashboard_id} />
        </div>

        <div className="controls-entry col flex-1">
          <i className="material-icons center-align">insert_chart</i>
        </div>

        <div className="controls-entry col more-vert flex-1">
          <MenuOptions id={this.props.dashboard_id} />
        </div>
      </div>
    );
  }
}
