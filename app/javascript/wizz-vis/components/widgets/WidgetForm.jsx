/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GeneralTab from './forms/GeneralTab';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = {
  rightAppBar: {
    marginLeft: 'auto',
    marginRight: 0,
  }
};

export default class WidgetForm extends React.Component {

  state = {
    selected_tab: 0,
  };

  handleTabChange = (event, selected_tab) => {
    this.setState({ selected_tab });
  };

  closeForm = () => {
    this.props.onClose();
  }

  render () {
    const { datasources } = this.props;
    const { selected_tab } = this.state;
    const close_button = <i className="material-icons primary-color-text">close</i>;

    return (
      <div className="widget-form">
        <div className="row">
          <div className="col s12">
            <AppBar color='default' position="static">
              <Tabs value={selected_tab}
                    onChange={this.handleTabChange}
                    TabIndicatorProps={{className: 'primary-color'}}>
                <Tab label="General" />
                <Tab label="Metrics" />
                <Tab label="Options" />
                <Tab label="Range"  />
                <section style={styles.rightAppBar}>
                  <IconButton onClick={this.closeForm} color="inherit" aria-label="Edit">
                    <CloseIcon />
                  </IconButton>
                </section>
              </Tabs>
            </AppBar>
            {selected_tab === 0 && <TabContainer><GeneralTab datasources={datasources} /></TabContainer>}
            {selected_tab === 1 && <TabContainer>Metrics</TabContainer>}
            {selected_tab === 2 && <TabContainer>Options</TabContainer>}
            {selected_tab === 3 && <TabContainer>Range</TabContainer>}
          </div>
        </div>
      </div>
    )
  }
}

WidgetForm.propTypes = {
  datasources: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func
};
