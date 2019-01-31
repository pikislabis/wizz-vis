/* jshint esversion: 6 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import request from 'axios';
import WidgetForm from './widgets/WidgetForm';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../actions/index';
import PropTypes from 'prop-types';

const styles = theme => ({
  new_widget_button: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: '10px'
  }
});

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

  normalize_fields = (fields) => {
    const normalized_aggregators = fields.aggregators.map(aggregator => (
      {aggregator, aggregator_name: aggregator}
    ))

    return {
      ...fields,
      aggregators: normalized_aggregators
    }
  }

  submitWidget = () => {
    let { widgetFields } = this.props;
    const { dashboardId } = this.props;
    const { addWidget, clearFields }  = this.props.actions;

    widgetFields = this.normalize_fields(widgetFields);

    fetch(
      '/widgets.json',
      {
        method: 'POST',
        headers: {
          'X-CSRF-Token': ReactOnRails.authenticityToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widget: {
            dashboard_id: dashboardId,
            ...widgetFields
          }
        })
    })
    .then(r => r.json().then(widget => (addWidget(widget))))
    .then(() => this.hideWidgetForm())
    .then(() => clearFields())
    .catch(error => console.error(error))

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
    const { classes } = this.props;
    const { datasources } = this.state;

    return (
      <div className="widget-form-container">
        <div className="widget-graph">
          <div className={classes.new_widget_button}>
            <a onClick={this.submitWidget}
              className="btn-floating btn-large waves-effect waves-light primary-color">
              <i className="material-icons">add</i>
            </a>
          </div>
          <div className="preview-text">Graph Preview</div>
        </div>
        <WidgetForm onClose={this.hideWidgetForm} datasources={datasources} />
      </div>
    );
  }
}

WidgetEditable.propTypes = {
  dashboardId: PropTypes.number.isRequired,
  range: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    range: state.setRanges.range,
    startTime: state.setRanges.startTime,
    endTime: state.setRanges.endTime,
    filters: state.setFilters.filters,
    widgetFields: state.widgetFields
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WidgetEditable));
