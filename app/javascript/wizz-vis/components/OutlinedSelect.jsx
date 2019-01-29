/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  menu: {
    width: 200,
  }
});

class OutlinedSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected || ''
    }
  }

  handleChange = (event) => {
    const { onChange } = this.props;

    this.setState({selected: event.target.value})

    if (onChange !== undefined)
      onChange(event.target.value);
  }

  menuItems = () => {
    const { values } = this.props;

    return values.map(item => (
      <MenuItem key={item.value} value={item.value}>{item.label || item.value}</MenuItem>
    ));
  }

  render () {
    const { label, classes } = this.props;
    const { selected } = this.state;

    return (
      <TextField
        select
        label={label}
        variant="outlined"
        fullWidth={true}
        margin="dense"
        value={ selected }
        onChange={(event) => this.handleChange(event)}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
      >
        {this.menuItems()}
      </TextField>
    )
  }
}

OutlinedSelect.propTypes = {
  onChange: PropTypes.func,
  selected: PropTypes.string,
  label: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  }))
};

export default withStyles(styles)(OutlinedSelect);
