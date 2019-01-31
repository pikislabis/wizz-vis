/* jshint esversion: 6 */

import reloadReducer from './reload';
import rangesReducer from './range';
import filtersReducer from './filter';
import widgetsReducer from './widgets';
import widgetFormDisplayReducer from './widget_form_display';
import widgetFormFieldsReducer from './widget_form_fields';

// This is how you do a directory of reducers.
// The `import * as reducers` does not work for a directory, but only with a single file
export default {
  reloadTimestamp: reloadReducer,
  setRanges: rangesReducer,
  setFilters: filtersReducer,
  widgets: widgetsReducer,
  displayWidgetForm: widgetFormDisplayReducer,
  widgetFields: widgetFormFieldsReducer
};
