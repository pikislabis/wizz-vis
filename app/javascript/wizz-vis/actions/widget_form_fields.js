/* jshint esversion: 6 */

import {SET_WIDGET_FIELD, CLEAR_WIDGET_FIELDS} from '../constants';

export function setField(field, value) {
  return {
    type: SET_WIDGET_FIELD,
    field, value
  };
}

export function clearFields() {
  return {
    type: CLEAR_WIDGET_FIELDS
  };
}
