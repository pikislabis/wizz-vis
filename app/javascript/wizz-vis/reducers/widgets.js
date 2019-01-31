/* jshint esversion: 6 */

import { SET_WIDGETS, ADD_WIDGET } from '../constants';

const initialState = [];

export default function widgetsReducer(state = initialState, action) {
  const { type, value } = action;
  switch (type) {
    case SET_WIDGETS:
      return value;
    case ADD_WIDGET:
      return [value, ...state];
    default:
      return state;
  }
}
