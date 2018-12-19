/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Filters from '../components/Filters';

import * as actions from '../actions/index';

const FiltersContainer = ({ actions, ...props }) => (
  <Filters {...{ actions, ...props }} />
);

FiltersContainer.propTypes = {};

function mapStateToProps(state) {
  return {
    filters: state.setFilters.filters,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltersContainer);
