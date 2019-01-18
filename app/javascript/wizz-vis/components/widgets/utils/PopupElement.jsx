/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';

export default class PopupElement extends React.Component {
  render () {
    return (
      <li>
        <b>{this.props.name}:</b> {this.props.value}
      </li>
    )
  }
}

PopupElement.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])
};
