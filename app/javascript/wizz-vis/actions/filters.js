/* jshint esversion: 6 */

import * as actionTypes from '../constants';

export function updateFilters(value) {
  return {
    type: actionTypes.DASHBOARD_SET_FILTERS,
    value
  };
}
