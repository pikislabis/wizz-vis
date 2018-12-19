/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import ClearableInput from './ClearableInput';
import cs from 'classnames';

export default class FloatMenu extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onClose();
    }
  }

  render() {
    const { className } = this.props;

    const cssClass = cs('float-menu-container', className);

    if(!this.props.open) return null;

    return(
      <div className={cssClass}>
        <div ref={this.setWrapperRef} className="float-menu">
          {this.props.children}
        </div>
      </div>
    );
  }
}

FloatMenu.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
}
