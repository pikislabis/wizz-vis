/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import FloatMenu from './../FloatMenu';
import ClearableInput from './../ClearableInput';

export default class AddFilter extends React.Component {
  constructor(props){
    super(props);

    this.state = { openMenu: false, query: "" };
  }

  closeMenu = () => {
    this.setState( {openMenu: false} );
  }

  openMenu = () => {
    this.setState({ openMenu: true });
  }

  setQuery = (query) => {
    this.setState({ query });
  }

  addFilter = (id, name) => {
    const { onPendingFilter } = this.props;
    onPendingFilter(id, name);
    this.closeMenu();
  }

  render_dimension(dimension, key) {
    const { id, name } = dimension;

    return (
      <div onClick={() => this.addFilter(id, name)} key={key} className="dimension">
        <span className="highlight-string label">{name}</span>
      </div>
    )
  }

  render_dimensions() {
    const { query } = this.state;
    const { dimensions } = this.props;

    const filtered_dimensions = dimensions.filter(d => (
      d.name.toLowerCase().includes(query.toLowerCase())
    )).map((d, index) => (
      this.render_dimension(d, index)
    ));

    return (
      <div className="dimensions">
        {filtered_dimensions}
      </div>
    )
  }

  render() {
    const { query } = this.state;

    return(
      <div className="add-filter">
        <i className="material-icons add-button" onClick={this.openMenu}>add</i>
        <FloatMenu
          onClose={this.closeMenu}
          open={this.state.openMenu}>
          <div className="search-box">
            <ClearableInput
              value={query}
              onChange={this.setQuery}
              placeholder="Search" />
          </div>
          {this.render_dimensions()}
        </FloatMenu>
      </div>
    );
  }
}

AddFilter.propTypes = {
  onPendingFilter: PropTypes.func,
  dimensions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  )
};
