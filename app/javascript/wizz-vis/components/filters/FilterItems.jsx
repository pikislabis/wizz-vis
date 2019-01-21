/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from "react-dom";
import FilterItem from './FilterItem';
import OverFlowFilters from './OverFlowFilters';

const FILTER_ITEM_WIDTH = 165;

export default class FilterItems extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      maxItems: 0
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateMaxItems);
    this.updateMaxItems();
  }

  componentDidUpdate() {
    this.updateMaxItems();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateMaxItems);
  }

  updateMaxItems = () => {
    if(this._element == undefined) return;

    const width = this._element.clientWidth;
    const maxItems = Math.floor((width - 55) / FILTER_ITEM_WIDTH);

    if(maxItems != this.state.maxItems){
      this.setState({maxItems});
    }
  }

  render_filter_items() {
    const { onFilterUpdate, onFilterRemove, filters, datasourceIds } = this.props;
    const { maxItems } = this.state;

    return Object.values(filters || {}).slice(0, maxItems).map((f, index) => (
      <FilterItem
        onFilterUpdate={onFilterUpdate}
        onFilterRemove={onFilterRemove}
        key={index}
        datasourceIds={datasourceIds}
        dimensionName={f.dimension_name}
        dimensionId={f.dimension_id}
        operator={f.operator}
        values={f.values}
        pendingFilter={f.pendingFilter} />
    ));
  }

  render_overflow_items() {
    const { onFilterUpdate, onFilterRemove, filters, datasourceIds } = this.props;
    const { maxItems } = this.state;

    const overflow_filters = Object.values(filters || {}).slice(maxItems);

    if (overflow_filters.length == 0) return;

    return <OverFlowFilters
              onFilterUpdate={onFilterUpdate}
              onFilterRemove={onFilterRemove}
              filters={overflow_filters}
              datasourceIds={datasourceIds} />
  }

  render() {
    return(
      <div ref={ node => { this._element = node; }} className="filter-items">
        {this.render_filter_items()}
        {this.render_overflow_items()}
      </div>
    );
  }
}

FilterItems.propTypes = {
  onFilterUpdate: PropTypes.func,
  onFilterRemove: PropTypes.func,
  datasourceIds: PropTypes.arrayOf(PropTypes.number),
  filters: PropTypes.object
};
