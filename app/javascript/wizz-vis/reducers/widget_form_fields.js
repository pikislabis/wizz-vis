/* jshint esversion: 6 */

import { SET_WIDGET_FIELD } from '../constants';

const initialState = null;

export default function widgetFormFieldsReducer(state = initialState, action) {
  const { type, field, value } = action;
  switch (type) {
    case SET_WIDGET_FIELD:
      return Object.assign({}, state, {
        [field]: value
      });
    default:
      return state;
  }
}
