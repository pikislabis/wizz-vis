/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import MenuRange from './controls/MenuRange';
import FloatMenu from './FloatMenu';
import Reload from './controls/Reload';
import Fullscreen from './controls/Fullscreen';

export default class Controls extends React.Component {
  constructor(props){
    super(props);

    this.state = { openMenu: false };
  }

  closeMenu = () => {
    this.setState( {openMenu: false} );
  }

  openMenu = () => {
    this.setState({ openMenu: true });
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

        <div className="controls-entry col more-vert">
          <i className="material-icons" onClick={this.openMenu}>more_vert</i>
          <FloatMenu
            onClose={this.closeMenu}
            open={this.state.openMenu}>
            <span>
              <a href={this.edit_dashboard_url}>
                <i className="material-icons">edit</i> Edit
              </a>
            </span>
            <Fullscreen />
            <Reload />
          </FloatMenu>
        </div>
      </div>
    );
  }
}
