/* jshint esversion: 6 */

import * as actionTypes from '../constants';

const initialState = [];

// Name function the same as the reducer for debugging.
export default function filtersReducer(state = initialState, action) {
  const { type, value } = action;
  switch (type) {
    case actionTypes.DASHBOARD_SET_FILTERS:
      return value;
    default:
      return state;
  }
}
