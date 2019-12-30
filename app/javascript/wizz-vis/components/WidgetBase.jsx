/* jshint esversion: 6 */

import React from 'react';
import { connect } from 'react-redux';
import { ResponsiveContainer } from 'recharts';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import cs from 'classnames';
import request from 'axios';

import WidgetTitle from './widgets/WidgetTitle';
import WidgetSerie from './widgets/WidgetSerie';
import WidgetBar from './widgets/WidgetBar';
import WidgetPie from './widgets/WidgetPie';
import WidgetValue from './widgets/WidgetValue';
import WidgetLocation from './widgets/WidgetLocation';
import WidgetHeatmap from './widgets/WidgetHeatmap';
import WidgetTable from './widgets/WidgetTable';
import WidgetPlane from './widgets/WidgetPlane';
import WidgetPlaneLocation from './widgets/WidgetPlaneLocation';
import WidgetPlaneRoute from './widgets/WidgetPlaneRoute';
import WidgetChord from './widgets/WidgetChord';
import WidgetSankey from './widgets/WidgetSankey';
import WidgetMultiserie from './widgets/WidgetMultiserie';
import WidgetImage from './widgets/WidgetImage';
import WidgetRoute from './widgets/WidgetRoute';
import WidgetHistogram from './widgets/WidgetHistogram';
import WidgetText from './widgets/WidgetText';

import ErrorBoundary from './ErrorBoundary';

import Errors from './../utils/errors';
import Format from './../utils/format';

import PropTypes from 'prop-types';

const components = {
  WidgetSerie,
  WidgetBar,
  WidgetPie,
  WidgetValue,
  WidgetLocation,
  WidgetHeatmap,
  WidgetTable,
  WidgetPlane,
  WidgetPlaneLocation,
  WidgetPlaneRoute,
  WidgetChord,
  WidgetSankey,
  WidgetMultiserie,
  WidgetImage,
  WidgetRoute,
  WidgetHistogram,
  WidgetText
};

class WidgetBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      attributes: {},
      error: null,
      reloadTimestamp: null,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      range: this.props.range
    };
  }

  componentDidMount() {
    if(!this.playMode())
      this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { reloadTimestamp, range } = this.props;
    const { startTime, endTime } = this.state;

    if (reloadTimestamp !== prevProps.reloadTimestamp || range !== prevProps.range ||
        startTime !== prevState.startTime || endTime !== prevState.endTime ||
        JSON.stringify(this.props.filters) !== JSON.stringify(prevProps.filters)) {
      this.fetchData();
    }
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    button.addClass('active');
    return (
      request
        .post('/widgets/' + this.props.id + '/data.json',
        {
          widget: {
            range: this.state.range || '',
            start_time: this.state.startTime || '',
            end_time: this.state.endTime || '',
            filters: this.props.filters
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': ReactOnRails.authenticityToken()
          }
        })
        .then(response => Errors.handleErrors(response))
        .then(widget => {
          if(widget.data && JSON.stringify(widget.data) !== JSON.stringify(this.state.$$data) ||
            JSON.stringify(widget.attributes) !== JSON.stringify(this.state.attributes)) {
            this.setState({
              $$data: widget.data,
              attributes: widget.attributes,
              error: null
            });
          }
        })
        .then(data => button.removeClass('active'))
        .catch(error => {
          const message = error.response.data.error;
          button.removeClass('active');
          if(message !== this.state.error) {
            this.setState({ $$data: [], error: message });
          }
        })
    );
  }

  handleToUpdate = (startTime, endTime) => {
    this.setState({ startTime, endTime });
  }

  /*
   * Remove a widget (by id).
   */
  removeWidget () {
    if (!window.confirm('Are you sure you wish to delete this widget?'))
      return false;

    fetch(
      '/widgets/' + this.props.id + '.json',
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': ReactOnRails.authenticityToken()
        },
        credentials: 'same-origin'
      }
    )
    .then(response => this.props.remove())
    .catch(error => this.setState({ error: error }));
  }

  contentHeight () {
    if (this.refs.content !== undefined)
      return this.refs.content.clientHeight;
  }

  contentWidth () {
    if (this.refs.content !== undefined)
      return this.refs.content.clientWidth;
  }

  background (property) {
    return get(this.props.options.background, property);
  }

  playMode() {
    const playMode = get(this.props, 'options.playMode.enabled');
    return playMode == undefined ? false : playMode;
  }

  render () {
    const Type = components[this.props.type || 'WidgetSerie'];
    const color = this.background('color');

    const style = {
      backgroundColor: color == 'transparent' ? null : color
    };

    const cssClass = cs(
      'widget center-align',
      {
        'transparent-bg': color == 'transparent'
      }
    );

    const { links, showOverrideInterval } = this.props.options;

    return (
      <div className = { cssClass } style = { style }>
        <WidgetTitle
          widget_id={this.props.id}
          title={this.props.title}
          links={links}
          locked={this.props.locked}
          remove={this.removeWidget.bind(this)}
          intervalAttributes={this.props.interval_attributes}
          overrideInterval={this.props['override_interval?']}
          showOverrideInterval={showOverrideInterval}
        />
        <div className='widget-content' ref='content'>
          { this.background('image') ?
              <WidgetImage
                image = { this.background('image') }
                opacity = { this.background('opacity') }
              /> : null
          }
          <ErrorBoundary>
            <Type {...this.props} {...this.state.attributes}
              data={this.state.$$data}
              error={this.state.error}
              height={this.contentHeight()}
              width={this.contentWidth()}
              originalRange={this.props.range}
              originalStartTime={this.props.startTime}
              originalEndTime={this.props.endTime}
              reloadTimestamp={this.props.reloadTimestamp}
              handleToUpdate={this.handleToUpdate}/>
          </ErrorBoundary>
        </div>
      </div>
    )
  }
};

WidgetBase.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  options: PropTypes.object,
  locked: PropTypes.bool.isRequired,
  reloadTimestamp: PropTypes.number,
  remove: PropTypes.func,
  type: PropTypes.oneOf(Object.keys(components)),
  range: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  intervalAttributes: PropTypes.shape({
    range: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string
  }),
  overrideInterval: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    range: state.setRanges.range,
    startTime: state.setRanges.startTime,
    endTime: state.setRanges.endTime,
    reloadTimestamp: state.reloadTimestamp,
    filters: state.setFilters.filters
  };
}

export default connect(mapStateToProps)(WidgetBase);
