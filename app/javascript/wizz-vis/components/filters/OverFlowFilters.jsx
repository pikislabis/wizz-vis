/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import FloatMenu from './../FloatMenu';
import FilterItem from './FilterItem';
import cs from 'classnames';

export default class OverFlowFilters extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      openFilters: false
    }
  }

  componentDidMount = () => {
    const { openFilters } = this.state;

    if (this.has_pending_filters() && !openFilters) {
      this.setState({ openFilters: true });
    }
  }

  componentDidUpdate = () => {
    const { openFilters } = this.state;

    if (this.has_pending_filters() && !openFilters) {
      this.setState({ openFilters: true });
    }
  }

  has_pending_filters = () => {
    const { filters } = this.props;

    return filters.find(f => (
      f.pendingFilter
    ));
  }

  open_filters = () => {
    this.setState({ openFilters: true });
  }

  close_filters = () => {
    this.setState({ openFilters: false });
  }

  render_filters = () => {
    const { filters, datasourceIds, onFilterUpdate, onFilterRemove } = this.props;

    const filter_items = filters.map((f, index) => (
      <FilterItem
        key={index}
        className="overflow-item"
        onFilterUpdate={onFilterUpdate}
        onFilterRemove={onFilterRemove}
        dimensionName={f.dimension_name}
        dimensionId={f.dimension_id}
        operator={f.operator}
        values={f.values}
        pendingFilter={f.pendingFilter}
        datasourceIds={datasourceIds} />
    ))

    return <div>{filter_items}</div>;
  }

  render_menu = () => {
    const { filters } = this.props;
    const { openFilters } = this.state;

    return <FloatMenu
      className="fixed"
      onClose={this.close_filters}
      open={openFilters}>
      {this.render_filters()}
    </FloatMenu>
  }

  render() {

    const cssClass = cs('filter-item', 'overflow-items', {
      'pending-filter': this.has_pending_filters()
    });

    return <div className={cssClass}>
      <div onClick={this.open_filters} className="filter-container">
        +{this.props.filters.length}
      </div>
      {this.render_menu()}
    </div>
  }
}

OverFlowFilters.propTypes = {
  onFilterUpdate: PropTypes.func,
  onFilterRemove: PropTypes.func,
  filters: PropTypes.arrayOf(PropTypes.object),
  datasourceIds: PropTypes.arrayOf(PropTypes.number)
};
