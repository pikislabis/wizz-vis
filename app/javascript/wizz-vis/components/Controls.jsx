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
      <div className="dashboard-controls right">
        <div className="controls-entry col">
          <MenuRange id={this.props.dashboard_id} />
        </div>

        <div className="controls-entry col more-vert">
          <MenuOptions id={this.props.dashboard_id} />
        </div>
      </div>
    );
  }
}
