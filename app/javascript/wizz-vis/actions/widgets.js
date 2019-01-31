/* jshint esversion: 6 */

import {SET_WIDGETS, ADD_WIDGET} from '../constants';

export function setWidgets(value) {
  return {
    type: SET_WIDGETS,
    value
  };
}

export function addWidget(value) {
  return {
    type: ADD_WIDGET,
    value
  };
}
