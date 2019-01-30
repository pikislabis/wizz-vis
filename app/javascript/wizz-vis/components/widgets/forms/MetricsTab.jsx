/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import OutlinedSelect from '../../OutlinedSelect';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import OutlinedTextField from '../../OutlinedTextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import DownshiftMultiple from '../../DownshiftMultiple';

import * as actions from '../../../actions/index';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class MetricsTab extends React.Component {

  fieldOnChange = (field, value) => {
    this.props.actions.setField(field, value);
  }

  getDatasource = datasource_name => {
    const { datasources } = this.props;

    return datasources.find(d => (
      d.name == datasource_name
    ));
  }

  datasourceValues = () => {
    const { datasources } = this.props;

    return datasources.map((datasource) => (
      {value: datasource.name}
    ));
  }

  showDimensionField = () => {
    const { graphType, datasource_name } = this.props;

    if(datasource_name == null)
      return <OutlinedTextField label="Dimensions" disabled />;

    const selected_dimensions = this.props.dimensions;

    const dimensions =
      this.getDatasource(datasource_name).dimensions.map(d => (d.name));

    return <DownshiftMultiple
      label="Dimensions"
      selected={selected_dimensions}
      suggestions={dimensions}
      onChange={(value) => this.fieldOnChange('dimensions', value)}
    />
  }

  showAggregatorField = () => {
    const { graphType, datasource_name } = this.props;

    if(datasource_name == null)
      return <OutlinedTextField label="Aggregators" disabled />;

    const selected_aggregators = this.props.aggregators;

    const aggregators =
      this.getDatasource(datasource_name).aggregators.map(a => (a.name));

    return <DownshiftMultiple
      label="Aggregators"
      selected={selected_aggregators}
      suggestions={aggregators}
      onChange={(value) => this.fieldOnChange('aggregators', value)}
    />
  }

  showGranularityField = () => {
    const { graphType } = this.props;

    return <TextField
      label="Granularity"
      variant="outlined"
      fullWidth={true}
      margin="dense"
    />
  }

  showLimitField = () => {
    const { graphType } = this.props;

    return <TextField
      label="Limit"
      variant="outlined"
      fullWidth={true}
      margin="dense"
    />
  }

  postAggregatorOperatorValues = () => {
    const operators = ['+', '-', '*', '-'];

    return operators.map(operator => (
      {value: operator}
    ));
  }

  filterOperatorValues = () => {
    return [
      { label: '= Include', value: 'eq'  },
      { label: '!= Exclude', value: 'neq'  },
      { label: '~ Regex', value: 'regex'  }
    ];
  }

  render () {
    const { classes, datasource_name } = this.props;

    return (
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="title">General</Typography>
            <OutlinedSelect
              selected={datasource_name}
              label="Datasource"
              values={this.datasourceValues()}
              onChange={(value) => this.fieldOnChange('datasource_name', value)}
            />
          { this.showDimensionField() }
          { this.showAggregatorField() }
          { this.showGranularityField() }
          { this.showLimitField() }
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="title">Post Aggregators</Typography>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
            <TextField
              label="Field 1"
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
            <TextField
              label="Field 2"
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
            <OutlinedSelect
              label="Operator"
              values={this.postAggregatorOperatorValues()}
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="title">Filters</Typography>
            <TextField
              label="Dimension"
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
            <OutlinedSelect
              label="Operator"
              values={this.filterOperatorValues()}
            />
            <TextField
              label="Value"
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

MetricsTab.propTypes = {
  graphType: PropTypes.string,
  classes: PropTypes.object.isRequired,
  datasources: PropTypes.arrayOf(PropTypes.object)
};

function mapStateToProps(state) {
  return {
    datasource_name: state.widgetFields.datasource_name,
    dimensions: state.widgetFields.dimensions,
    aggregators: state.widgetFields.aggregators,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MetricsTab));
