/* jshint esversion: 6 */

import { SET_DISPLAY_WIDGET_FORM } from '../constants';

const initialState = null;

// Name function the same as the reducer for debugging.
export default function widgetFormReducer(state = initialState, action) {
  const { type, value } = action;
  switch (type) {
    case SET_DISPLAY_WIDGET_FORM:
      return value;
    default:
      return state;
  }
}
