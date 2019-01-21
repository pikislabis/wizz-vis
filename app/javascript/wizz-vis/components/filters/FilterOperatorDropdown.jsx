/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import request from 'axios';
import Dropdown from './../Dropdown';

const OPERATORS = [
  {
    icon: '=',
    label: 'Include',
    value: 'eq'
  },
  {
    icon: '!=',
    label: 'Exclude',
    value: 'neq'
  },
  {
    icon: '~',
    label: 'Regex',
    value: 'regex'
  }
];

export default class FilterOperatorDropdown extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    const { operator, onChange } = this.props;

    return (
      <div className="operator-selector">
        <Dropdown
          items={OPERATORS}
          selectedItem={operator}
          onSelect={onChange}
        />
      </div>
    )
  }
}

FilterOperatorDropdown.propTypes = {
  operator: PropTypes.string,
  onChange: PropTypes.func

};
