/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ThresholdsSection from './ThresholdsSection';
import ColorPicker from 'material-ui-color-picker';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class OptionsTab extends React.Component {
  showMainColor = () => {
    return (
      <ColorPicker
        name='color'
        defaultValue='#000'
        TextFieldProps={
          {label: "Main Color", variant: "outlined", margin: "dense", fullWidth: true}
        }
      />
    )
  }

  render () {
    const { classes } = this.props;

    return (
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="title">General</Typography>
            { this.showMainColor() }
          </Paper>
        </Grid>
        <ThresholdsSection />
      </Grid>
    )
  }
}

OptionsTab.propTypes = {
  graphType: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OptionsTab);
