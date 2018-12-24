/* jshint esversion: 6 */

import { init } from './loader';
import FiltersContainer from '../containers/FiltersContainer';

/*
*  Initialize the Controls component, depending on a common store.
*/
export default (props, railsContext, domNodeId) => {
  init(FiltersContainer, props, domNodeId);
};
