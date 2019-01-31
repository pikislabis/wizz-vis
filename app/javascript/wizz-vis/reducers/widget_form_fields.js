/* jshint esversion: 6 */

import { SET_WIDGET_FIELD, CLEAR_WIDGET_FIELDS } from '../constants';

const initialState = {
    type: null,
    title: '',
    granularity: null,
    limit: 5,
    datasource_name: null,
    dimensions: [],
    aggregators: [],
    post_aggregators: [],
    filters: [],
    options: {}
};

export default function widgetFormFieldsReducer(state = initialState, action) {
  const { type, field, value } = action;
  switch (type) {
    case SET_WIDGET_FIELD:
      return Object.assign({}, state, {
        [field]: value
      });
    case CLEAR_WIDGET_FIELDS:
      return initialState;
    default:
      return state;
  }
}
