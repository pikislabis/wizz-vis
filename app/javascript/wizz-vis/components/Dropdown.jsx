/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import request from 'axios';

export default class Dropdown extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      openMenu: false
    }
  }

  toggleMenu = () => {
    const { openMenu } = this.state;
    this.setState({ openMenu: !openMenu });
  }

  renderMenu = () => {
    const { onSelect } = this.props;

    const items = this.props.items.map((item) => {
      return (
        <div onClick={() => onSelect(item.value)} key={item.value} className="dropdown-item">
          <span className="item-icon">{item.icon}</span>
          <span className="item-label">{item.label}</span>
        </div>
      )
    });

    return <div className="dropdown-menu">
      {items}
    </div>
  }

  renderSelectedItem = () => {
    const { selectedItem, items } = this.props;

    return items.find(i => (
      i.value == selectedItem
    )).icon;
  }

  render() {
    const { openMenu } = this.state;


    return (
      <div className="dropdown" onClick={this.toggleMenu}>
        <div className="selected-item">{this.renderSelectedItem()}</div>
        {openMenu ? this.renderMenu() : null}
      </div>
    )
  }
}

Dropdown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  selectedItem: PropTypes.string,
  onSelect: PropTypes.func
};
