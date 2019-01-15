/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import FloatMenu from './../FloatMenu';
import FilterMenu from './FilterMenu';
import cs from 'classnames';

export default class FilterItem extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      openMenu: this.props.pendingFilter
    }
  }

  render_operator(operator) {
    switch (operator) {
      case 'eq':
        return '=';
      case 'neq':
        return '!=';
      case 'regex':
        return '~';
      default:
        return ':';
    }
  }

  open_menu = () => {
    this.setState({ openMenu: true });
  }

  close_menu = () => {
    const { pendingFilter } = this.props;

    if (pendingFilter) {
      this.setState({ openMenu: false });
      this.filter_remove();
    } else {
      this.setState({ openMenu: false });
    }
  }

  filter_remove = () => {
    const { onFilterRemove, dimensionName } = this.props;
    onFilterRemove(dimensionName);
  }

  render_menu() {
    const { openMenu } = this.state;
    const { onFilterUpdate, operator, values, dimensionName, dimensionId, datasourceIds } = this.props;

    return (
      <FloatMenu
        onClose={this.close_menu}
        open={openMenu}>
        <FilterMenu
          onFilterUpdate={onFilterUpdate}
          onClose={this.close_menu}
          operator={operator}
          selectedValues={values}
          datasourceIds={datasourceIds}
          dimensionName={dimensionName}
          dimensionId={dimensionId} />
      </FloatMenu>
    )
  }

  render() {
    const { className, onFilterRemove, dimensionName, pendingFilter, operator, values } = this.props;

    const cssClass = cs('filter-item', className, {
      'pending-filter': pendingFilter
    });

    return(
      <div className={cssClass}>
        <div className="filter-container">
          <div onClick={this.open_menu} className="filter-dimension">
            <span className="dimension-title">{dimensionName}</span>
            <span className="filter-operator">{this.render_operator(operator)}</span>
            {
              values.length > 1 ?
                <span className="filter-values">({values.length})</span> :
                <span className="filter-values">{values}</span>
            }
          </div>
          <div onClick={this.filter_remove} className="remove">
            <i className="material-icons">close</i>
          </div>
        </div>
        {this.render_menu()}
      </div>
    );
  }
}

FilterItem.propTypes = {
  className: PropTypes.string,
  onFilterUpdate: PropTypes.func,
  onFilterRemove: PropTypes.func,
  dimensionName: PropTypes.string,
  dimensionId: PropTypes.number,
  operator: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string),
  datasourceIds: PropTypes.arrayOf(PropTypes.number),
  pendingFilter: PropTypes.bool
};
