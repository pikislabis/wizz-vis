/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedSelect from '../../OutlinedSelect';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class MetricsTab extends React.Component {

  datasourceValues = () => {
    const { datasources } = this.props;

    return datasources.map((datasource) => (
      {value: datasource.name}
    ));
  }

  showDimensionField = () => {
    const { graphType } = this.props;

    return <TextField
      label="Dimension"
      variant="outlined"
      fullWidth={true}
      margin="dense"
    />
  }

  showAggregatorField = () => {
    const { graphType } = this.props;

    return <TextField
      label="Aggregator"
      variant="outlined"
      fullWidth={true}
      margin="dense"
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
    const { classes } = this.props;

    return (
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="title">General</Typography>
            <OutlinedSelect
              label="Datasource"
              values={this.datasourceValues()}
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

export default withStyles(styles)(MetricsTab);