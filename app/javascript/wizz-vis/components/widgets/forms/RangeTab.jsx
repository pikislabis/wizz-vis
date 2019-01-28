/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FixedRange from '../../controls/FixedRange';
import RelativeRange from '../../controls/RelativeRange';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class RangeTab extends React.Component {
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
    const { classes } = this.props;

    return (
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <Paper className={classes.paper} elevation={1}>
            <div className="range-selector">
              <div className="button-group">
                <ul className="group-container">
                  <li className={"group-member " + (this.state.menuType == 'relative' ? 'primary-color' : '')}
                    onClick={ () => this.setMenu('relative') }>Relative</li>
                  <li className={"group-member " + (this.state.menuType == 'fixed' ? 'primary-color' : '')}
                    onClick={ () => this.setMenu('fixed') }>Fixed</li>
                </ul>
              </div>

              { this.state.menuType == 'relative' ?
                <RelativeRange />
                :
                <FixedRange />
              }
            </div>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

RangeTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RangeTab);
