/* jshint esversion: 6 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import request from 'axios';

import { Tabs, Tab } from 'react-materialize';

import * as actions from '../actions/index';
import PropTypes from 'prop-types';

class WidgetEditable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datasources: []
    };
  }

  componentDidMount() {
    this.fetchDatasources();
  }

  hideWidgetForm = () => {
    this.props.actions.displayWidgetForm(false);
  }

  fetchDatasources() {
    return (
      request
        .get('/datasources.json', { responseType: 'json' })
        .then(res => this.setState({
          datasources: res.data
        }))
    );
  }

  render () {
    const close_button = <i onClick={this.hideWidgetForm}
                            className="material-icons primary-color-text">close</i>;

    return (
      <div className="widget-form-container">
        <div className="widget-graph">WidgetGraph</div>
        <div className="widget-form">
          <div className="row">
            <div className="col s12">
              <Tabs>
                <Tab title="General" active>General</Tab>
                <Tab title="Metrics">Metrics</Tab>
                <Tab title="Options">Options</Tab>
                <Tab title="Range">Range</Tab>
                <Tab title={close_button} className="close_button right" />
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WidgetEditable.propTypes = {
  range: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string
};

function mapStateToProps(state) {
  return {
    range: state.setRanges.range,
    startTime: state.setRanges.startTime,
    endTime: state.setRanges.endTime,
    filters: state.setFilters.filters
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetEditable);
