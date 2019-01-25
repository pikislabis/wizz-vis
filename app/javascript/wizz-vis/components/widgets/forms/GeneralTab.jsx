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

const widgetTypes = [
  'WidgetSerie',
  'WidgetBar',
  'WidgetHeatmap'
]

class GeneralTab extends React.Component {

  widgetTypesValues = () => {
    return widgetTypes.map((t) => (
      {value: t}
    ));
  }

  drilldownTypeValues = () => {
    return [
      {value: 'dashboard'},
      {value: 'absolute'}
    ]
  }

  render () {
    const { classes } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="title">Info</Typography>
            <OutlinedSelect
              label="Type"
              values={this.widgetTypesValues()}
            />
            <TextField
              label="Title"
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
            <TextField
              label="Description"
              rows="4"
              multiline
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="title">Drilldowns</Typography>
            <OutlinedSelect
              label="Type"
              values={this.drilldownTypeValues()}
            />
            <TextField
              label="URL"
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
            <TextField
              label="Title"
              variant="outlined"
              fullWidth={true}
              margin="dense"
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

GeneralTab.propTypes = {
  classes: PropTypes.object.isRequired,
  datasources: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(styles)(GeneralTab);
