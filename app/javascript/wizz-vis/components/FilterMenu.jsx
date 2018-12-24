/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import request from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ClearableInput from './ClearableInput';
import FilterOperatorDropdown from './FilterOperatorDropdown';

class FilterMenu extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      loading: true,
      dimensionValues: [],
      pendingChanges: false,
      selectedValues: this.props.selectedValues,
      pendingValues: this.props.selectedValues,
      selectedOperator: this.props.operator,
      query: ""
    }
  }

  componentDidMount() {
    const { operator, dimensionName, datasourceIds, selectedValues } = this.props;

    const conditions = operator == 'regex' ? selectedValues[0] : "";

    this.setState({ query: conditions });

    if(datasourceIds == undefined) return;

    datasourceIds.forEach(datasource_id => {
      this.fetchValues(datasource_id, dimensionName, operator, conditions);
    }, this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { datasourceIds, dimensionName } = this.props;
    const { query, selectedOperator } = this.state;

    if (prevState.query !== query || prevState.selectedOperator !== selectedOperator) {
      this.setState({ dimensionValues: [] });

      datasourceIds.forEach(datasource_id => {
        this.fetchValues(datasource_id, dimensionName, selectedOperator, query);
      }, this);
    }
  }

  fetchValues = (datasource_id, dimension_name, operator, query) => {
    const { range, startTime, endTime } = this.props;

    this.setState({loading: true});

    request
      .get('/datasources/' + datasource_id + '/dimensions/' + dimension_name + '/values.json', {
        params: {
          start_time: startTime,
          end_time: endTime,
          range,
          operator,
          query,
          limit: 25
        },
        responseType: 'json'
      })
      .then(res => {
        let dimensionValues = this.state.dimensionValues;
        dimensionValues = [...(new Set(dimensionValues.concat(...res.data)))]
        this.setState({ dimensionValues, loading: false })
      });
  }

  get_selectable_dimensions = (selected_values, dimension_values) => {
    const { selectedOperator, query } = this.state;

    if(selectedOperator == 'regex'){
      return dimension_values;
    } else if (query !== "") {
      return dimension_values;
    } else {
      return selected_values.concat(
        ...dimension_values.filter(d => (
          !selected_values.includes(d)
        ))
      )
    }
  }

  toggleValue = (value) => {
    const { pendingValues } = this.state;

    if(pendingValues.includes(value)){
      this.setState({
        pendingChanges: true,
        pendingValues: this.state.pendingValues.filter(v => v != value)
      })
    } else {
      this.setState({
        pendingChanges: true,
        pendingValues: this.state.pendingValues.concat(value)
      })
    }
  }

  render_loading = () => {
    return (
      <div className="preloader-wrapper small active">
        <div className="spinner-layer spinner-primary-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div><div className="gap-patch">
            <div className="circle"></div>
          </div><div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    )
  }

  inputOnChange = (query) => {
    const { selectedOperator } = this.state;

    if (selectedOperator == 'regex') {
      this.setState({ pendingValues: [query], pendingChanges: true, query });
    } else {
      this.setState({ query });
    }
  }

  selectorOnChange = (operator) => {
    this.setState({ selectedOperator: operator, pendingChanges: true });
  }

  render_options = () => {
    const { selectedOperator, query } = this.state;

    return (
      <div className="filter-options">
        <FilterOperatorDropdown
          operator={selectedOperator}
          onChange={this.selectorOnChange}
        />
        <div className="search-box">
          <ClearableInput onChange={this.inputOnChange} value={query} placeholder="Search" />
        </div>
      </div>
    )
  }

  render_values = () => {
    const { selectedOperator, loading, pendingValues, selectedValues, dimensionValues } = this.state;

    if (loading) {
      return this.render_loading();
    }

    const selectableDimensions = this.get_selectable_dimensions(selectedValues, dimensionValues);

    return selectableDimensions.map((value, index) => (
      <div key={index} className="dimension-value">
        {
          selectedOperator !== 'regex' ?
            <div onClick={() => this.toggleValue(value)} className="checkbox check">
              <div className="checkbox-body">
                {
                  pendingValues.includes(value) ?
                    <i className="material-icons">check</i> :
                    null
                }
              </div>
            </div> : null
        }
        <span className="highlight-string label">{value}</span>
      </div>
    ));
  }

  render_bar = () => {
    return (
      <div className="ok-cancel-bar">
        <button onClick={this.close_menu} className="btn btn-small">Cancel</button>
        <button
          className="btn btn-small primary-color"
          onClick={this.update_filter}
          disabled={!this.ok_enabled()}>
          OK
        </button>
      </div>
    )
  }

  close_menu = () => {
    this.props.onClose();
  }

  ok_enabled = () => {
    const { pendingChanges } = this.state;

    return pendingChanges;
  }

  update_filter = () => {
    const { onFilterUpdate, dimensionName, dimensionId } = this.props;
    const { selectedOperator, pendingValues } = this.state;

    onFilterUpdate(dimensionName, dimensionId, selectedOperator, pendingValues);
    this.close_menu();
  }

  render() {
    const { operator } = this.props;

    return (
      <div className="filter-menu-container">
        {this.render_options()}
        <div className="dimension-values">
          {this.render_values()}
        </div>
        {this.render_bar()}
      </div>
    )
  }
}

FilterMenu.propTypes = {
  onFilterUpdate: PropTypes.func,
  operator: PropTypes.string,
  selectedValues: PropTypes.arrayOf(PropTypes.string),
  dimensionName: PropTypes.string,
  dimensionId: PropTypes.number,
  datasourceIds: PropTypes.arrayOf(PropTypes.number),
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  range: PropTypes.string,
  onClose: PropTypes.func
};

function mapStateToProps(state) {
  return {
    startTime: state.setRanges.startTime,
    endTime: state.setRanges.endTime,
    range: state.setRanges.range
  };
}

export default connect(mapStateToProps)(FilterMenu);
