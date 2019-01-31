/* jshint esversion: 6 */

import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import request from 'axios';
import {Responsive, WidthProvider} from 'react-grid-layout';
import WidgetBase from './WidgetBase';
import WidgetEditable from './WidgetEditable';
import Clock from './Clock';
import reject from 'lodash/reject';

import * as actions from '../actions/index';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 12, sm: 12, xs: 1, xxs: 1 };
const ROWHEIGHT = 100;

class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fetchWidgetsError: null,
      updateLayoutError: null
    };
  }

  componentDidMount() {
    this.fetchWidgets();
    this.setState({
      isDraggable: this.isDraggable()
    });
  }

  fetchWidgets() {
    const { setWidgets } = this.props.actions;

    return (
      request
        .get('/dashboards/' + this.props.id + '/widgets.json', { responseType: 'json' })
        .then(res => setWidgets(res.data))
        .catch(error => this.setState({ fetchWidgetsError: error }))
    );
  }

  removeItem (widget_id) {
    const { widgets } = this.props;
    const { setWidgets } = this.props.actions;

    setWidgets(
      reject(widgets, { id: widget_id })
    );
  }

  onLayoutChange(layout) {
    if (!this.isDraggable()) return true;

    fetch(
      '/dashboards/' + this.props.id + '/layout.json',
      {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': ReactOnRails.authenticityToken()
        },
        body: JSON.stringify({ layout: layout })
      }
    )
    .catch(error => this.setState({ updateLayoutError: error }));
  }

  isDraggable() {
    const node = ReactDOM.findDOMNode(this);
    return node.offsetWidth >= BREAKPOINTS.sm &&
      !Modernizr.touchevents &&
      !this.props.locked;
  }

  layout = () => {
    const { widgets } = this.props;

    const layout = widgets.map(w => (
      { i: w.id.toString(), x: w.col, y: w.row, w: w.size_x, h: w.size_y }
    ))

    return { lg: layout };
  }

  render () {
    const { displayWidgetForm } = this.props;
    const layout = this.layout();

    const widgets =
      this.props.widgets.map((w, index) => {
        return (<div key={ w.id }>
                  <WidgetBase {...w}
                  locked={this.props.locked}
                  theme={this.props.theme}
                  remove={ this.removeItem.bind(this, w.id) } />
                </div>);
      });

    return (
      <div ref='dashboard'>
        { this.props.interval ?
            <Clock interval={ this.props.interval } />
            : null
        }

        {
          displayWidgetForm ?
            <WidgetEditable dashboardId={this.props.id} /> :
            <ResponsiveReactGridLayout
              className={'layout ' + this.props.theme}
              isDraggable={ this.state.isDraggable }
              isResizable={ this.state.isDraggable }
              layouts={layout}
              rowHeight={ROWHEIGHT}
              breakpoints={BREAKPOINTS}
              cols={COLS}
              draggableHandle=".widget-title"
              onLayoutChange={ (layout) => this.onLayoutChange(layout) }>
              { widgets }
            </ResponsiveReactGridLayout>
        }
      </div>
    );
  }
}

Dashboard.propTypes = {
  id: PropTypes.number.isRequired,
  theme: PropTypes.oneOf(['dark', 'light']),
  interval: PropTypes.oneOf([30, 60, 300, 900, 1800, 3600, 7200]),
  locked: PropTypes.bool,
  displayWidgetForm: PropTypes.bool,
  widgets: PropTypes.arrayOf(PropTypes.object)
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(null, mapDispatchToProps)(Dashboard);
