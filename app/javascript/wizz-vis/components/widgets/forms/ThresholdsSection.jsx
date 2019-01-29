/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ColorPicker from 'material-ui-color-picker';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class ThresholdsSection extends React.Component {
  render () {
    const { classes } = this.props;

    return (
      <Grid item xs={4}>
        <Paper className={classes.paper} elevation={1}>
          <Typography variant="title">Thresholds</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth={true}
            margin="dense"
          />
          <TextField
            label="Value"
            variant="outlined"
            fullWidth={true}
            margin="dense"
          />
          <ColorPicker
            name='color'
            defaultValue='#000'
            TextFieldProps={
              {label: "Color", variant: "outlined", margin: "dense", fullWidth: true}
            }
          />
        </Paper>
      </Grid>
    )
  }
}

ThresholdsSection.propTypes = {
  thresholds: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object.isRequired
};

export default  withStyles(styles)(ThresholdsSection);
