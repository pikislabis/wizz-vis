/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import deburr from 'lodash/deburr';
import keycode from 'keycode';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
      variant="outlined"
      margin="dense"
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 999,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto !important',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

class DownshiftMultiple extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      selectedItem: this.props.selected || [],
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.suggestions !== prevProps.suggestions)
      this.setState({ selectedItem: [] });
  }

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state;
    if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }
  };

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleChange = item => {
    //let { selectedItem } = this.state;
    let { selected } = this.props;
    const { onChange } = this.props;

    if (selected.indexOf(item) === -1) {
      selected = [...selected, item];
    }

    onChange(selected);

    this.setState({
      inputValue: '',
    //   selectedItem,
    });
  };

  handleDelete = item => () => {
    //let { selectedItem } = this.state;
    let { selected } = this.props;
    const { onChange } = this.props;

    selected.splice(selected.indexOf(item), 1);
    onChange(selected);

    // this.setState({
    //   selectedItem
    // });
  };

  getSuggestions = value => {
    const { suggestions } = this.props;
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 && suggestion.slice(0, inputLength).toLowerCase() === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  }

  render() {
    const { selected, classes, label } = this.props;
    const { inputValue, selectedItem } = this.state;

    return (
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selected}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: selected.map(item => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className={classes.chip}
                    onDelete={this.handleDelete(item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
              }),
              label: label,
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {this.getSuggestions(inputValue2).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

DownshiftMultiple.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

DownshiftMultiple.defaultProps = {
  selected: []
}

export default withStyles(styles)(DownshiftMultiple);
