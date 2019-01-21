/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/index';

class Reload extends React.Component {
  constructor(props){
    super(props);
    this.updateReload = this.updateReload.bind(this);
  }

  updateReload() {
    this.props.actions.updateReload(Date.now());
  }

  render() {
    return(
      <span>
        <a href="#" onClick={ this.updateReload }>
          <i className="material-icons">refresh</i> Force Reload
        </a>
      </span>
    );
  }
}

function mapStateToProps(state) {
  return {
    reloadTimestamp: state.reloadTimestamp
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reload);
