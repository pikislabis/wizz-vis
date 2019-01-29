/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

export default class OutlinedTextField extends React.Component {
  render () {
    const { label, disabled }  = this.props;

    return <TextField label={label}
    disabled
    variant="outlined"
    fullWidth={true}
    margin="dense" />;
  }
}

OutlinedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

OutlinedTextField.defaultProps = {
  disabled: false
};
