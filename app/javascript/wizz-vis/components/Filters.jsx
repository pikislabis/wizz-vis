/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import AddFilter from './AddFilter';
import FilterItems from './FilterItems';

export default class Filters extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      pendingFilter: null
    }
  }

  group_filters() {
    const { filters } = this.props;
    const { pendingFilter } = this.state;

    if (filters == undefined) return {};

    let grouped_filters = filters.reduce((group, filter) => {
      if(group[filter.dimension_name]){
        group[filter.dimension_name].values.push(filter.value)
        return group;
      } else {
        group[filter.dimension_name] = {
          dimension_name: filter.dimension_name,
          dimension_id: filter.dimension_id,
          operator: filter.operator,
          values: [filter.value]
        }

        return group;
      }
    }, {});

    if (pendingFilter) {
      grouped_filters[pendingFilter.dimension_name] = pendingFilter;
    }

    return grouped_filters;
  }

  get_datasources(dimensions) {
    return [...(new Set(
      dimensions.map(dimension => {
        return dimension.datasource_id
      })
    ))];
  }

  dimension_on_filters(dimension_name) {
    const grouped_filters = this.group_filters();
    return grouped_filters[dimension_name];
  }

  dimensions() {
    const { dimensions } = this.props;

    return dimensions.filter(d => (
      d.name !== "__time" && !this.dimension_on_filters(d.name)
    )).map(d => (
      { id: d.id, name: d.name }
    ));
  }

  updateDashboard = (filters) => {
    const { dashboard_id } = this.props;

    fetch(
      '/dashboards/' + dashboard_id + '.json',
      { method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': ReactOnRails.authenticityToken()
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          dashboard: {
            filters_attributes: filters
          }
        })
      }
    );
  }

  update_filter = (dimension_name, dimensionId, operator, values) => {
    const { filters } = this.props;

    // group filters to keep same order
    let grouped_filters = filters.reduce((group, filter) => {
      if(group[filter.dimension_name]){
        group[filter.dimension_name].values.push(filter.value)
        return group;
      } else {
        group[filter.dimension_name] = {
          dimension_name: filter.dimension_name,
          dimension_id: filter.dimension_id,
          operator: filter.operator,
          values: [filter.value]
        }

        return group;
      }
    }, {});

    grouped_filters[dimension_name] = {
      dimension_name: dimension_name,
      dimension_id: dimensionId,
      operator: operator,
      values: values
    }

    const new_filters = Object.values(grouped_filters).reduce((filters, filter) => {
      return filters.concat(
        filter.values.map((v) => (
          {
            dimension_name: filter.dimension_name,
            dimension_id: filter.dimension_id,
            operator: filter.operator,
            value: v
          }
        ))
      )
    }, []);

    this.props.actions.updateFilters({filters: new_filters});
    this.updateDashboard(new_filters);
  }

  remove_filter = (dimension_name) => {
    const { filters } = this.props;
    const { pendingFilter } = this.state;

    if (pendingFilter && pendingFilter.dimension_name == dimension_name) {
      this.setState({ pendingFilter: null });
      return;
    }

    const new_filters = filters.filter(f => (
      f.dimension_name !== dimension_name
    ))

    this.props.actions.updateFilters({filters: new_filters});
    this.updateDashboard(new_filters);
  }

  add_pending_filter = (dimension_id, dimension_name) => {
    this.setState({
      pendingFilter: { dimension_name,
                       dimension_id,
                       operator: 'eq',
                       values: [],
                       pendingFilter: true }
    });
  }

  render() {
    const { dimensions } = this.props;
    const { pendingFilter } = this.state;

    const grouped_filters = this.group_filters();
    const datasource_ids = this.get_datasources(dimensions);

    return(
      <div className='filters-container input-field col s12'>
        <div className="filters">
          <div className='title'>Filters</div>
          <FilterItems
            ref="filter-items"
            onFilterUpdate={this.update_filter}
            onFilterRemove={this.remove_filter}
            filters={grouped_filters}
            datasourceIds={datasource_ids} />
          <AddFilter onPendingFilter={this.add_pending_filter} dimensions={this.dimensions()} />
        </div>
      </div>
    );
  }
}

Filters.propTypes = {
  dashboard_id: PropTypes.number,
  dimensions: PropTypes.arrayOf(PropTypes.object),
  filters: PropTypes.arrayOf(PropTypes.object)
};
