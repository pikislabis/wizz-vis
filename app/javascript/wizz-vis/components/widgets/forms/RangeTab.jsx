/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import FixedRange from '../../controls/FixedRange';
import RelativeRange from '../../controls/RelativeRange';

export default class RangeTab extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      menuType: 'relative'
    };
  }

  setMenu = (value) => {
    this.setState({ menuType: value });
  }

  render () {
    return (
      <Paper elevation={1}>
        <div className="menu-range">
          <div className="float-menu">
            <div className="button-group">
              <ul className="group-container">
                <li className={"group-member " + (this.state.menuType == 'relative' ? 'primary-color' : '')}
                  onClick={ () => this.setMenu('relative') }>Relative</li>
                <li className={"group-member " + (this.state.menuType == 'fixed' ? 'primary-color' : '')}
                  onClick={ () => this.setMenu('fixed') }>Fixed</li>
              </ul>
            </div>
          </div>
        </div>

        { this.state.menuType == 'relative' ?
          <RelativeRange />
          :
          <FixedRange />
        }
      </Paper>
    )
  }
}
