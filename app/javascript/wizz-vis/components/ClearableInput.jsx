/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';

export default class ClearableInput extends React.Component {
  constructor(props){
    super(props);
  }

  clear = () => {
    this.props.onChange("");
  }

  change = (event) => {
    this.props.onChange(event.target.value);
  }

  render() {
    const classNames = ['clearable-input'];
    if (this.props.className) classNames.push(this.props.className);

    return(
      <div className={classNames.join(" ")}>
        <input
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.change}
        />
      <div className="clear" onClick={this.clear}>
          <i className="material-icons">close</i>
        </div>
      </div>
    );
  }
}

ClearableInput.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string
};
