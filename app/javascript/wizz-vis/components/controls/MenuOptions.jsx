/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import FloatMenu from './../FloatMenu';
import Reload from './Reload';
import Fullscreen from './Fullscreen';

export default class MenuOptions extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  closeMenu = () => {
    this.setState( {menuOpen: false} );
  }

  openMenu = () => {
    this.setState({ menuOpen: true });
  }

  get edit_dashboard_url() {
    return `/dashboards/${this.props.id}/edit`;
  }

  render() {
    return(
      <div>
        <i className="material-icons right" onClick={this.openMenu}>more_vert</i>
        <FloatMenu
          onClose={this.closeMenu}
          open={this.state.menuOpen}>
          <span>
            <a href={this.edit_dashboard_url}>
              <i className="material-icons">edit</i> Edit
            </a>
          </span>
          <Fullscreen />
          <Reload />
        </FloatMenu>
      </div>
    );
  }
}
