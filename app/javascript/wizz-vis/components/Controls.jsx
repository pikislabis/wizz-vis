/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MenuRange from './controls/MenuRange';
import MenuOptions from './controls/MenuOptions';

import * as actions from '../actions/index';

class Controls extends React.Component {
  constructor(props){
    super(props);
  }

  showWidgetForm = () => {
    this.props.actions.displayWidgetForm(true);
  }

  render() {
    return(
      <div className="dashboard-controls">
        <div className="controls-entry col flex-5 center">
          <MenuRange id={this.props.dashboard_id} />
        </div>

        <div className="controls-entry col flex-1">
          <i onClick={this.showWidgetForm} className="material-icons center-align">insert_chart</i>
        </div>

        <div className="controls-entry col more-vert flex-1">
          <MenuOptions id={this.props.dashboard_id} />
        </div>
      </div>
    );
  }
}

Controls.propTypes = {
  dashboard_id: PropTypes.number
}

function mapStateToProps(state) {
  return {
    displayWidgetForm: state.displayWidgetForm
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
