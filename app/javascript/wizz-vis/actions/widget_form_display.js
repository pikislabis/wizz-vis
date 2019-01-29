/* jshint esversion: 6 */

import {SET_DISPLAY_WIDGET_FORM} from '../constants';

export function displayWidgetForm(value) {
  return {
    type: SET_DISPLAY_WIDGET_FORM,
    value
  };
}
