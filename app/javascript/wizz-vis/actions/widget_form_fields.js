/* jshint esversion: 6 */

import {SET_WIDGET_FIELD} from '../constants';

export function setField(field, value) {
  return {
    type: SET_WIDGET_FIELD,
    field, value
  };
}
