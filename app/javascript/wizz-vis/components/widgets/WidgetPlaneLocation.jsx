/*jshint esversion: 6 */
import React from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Circle, Label, Tag, Text } from 'react-konva';
import WidgetImage from './WidgetImage';
import Info from './utils/Info';
import DateTimeInterval from './utils/DateTimeInterval';
import gps_utils from './../../utils/gps';
import Time from './../../utils/time';
import Format from './../../utils/format';
import StorageCtrl from './../../utils/storage';
import Locatable from './../../models/locatable';
import castArray from 'lodash/castArray';
import sortBy from 'lodash/sortBy';
import * as common from './../../props';
import cs from 'classnames';
import get from 'lodash/get';
import { MapInteraction } from 'react-map-interaction';

const DEFAULT_MARKER_COLOR = "#8a8acb";

export default class WidgetPlaneLocation extends React.Component {
  constructor(props) {
    super(props);

    this.timer = this.startTime = this.endTime = null;

    this.initializeDates();

    this.image = {
      clientWidth: 0,
      clientHeight: 0,
      naturalWidth: 0,
      naturalHeight: 0
    };

    this.coordinate_field = '';
    this.aggregators = [];
    this.grouped_dimensions = [];

    this.scaleOffset = 0;
    this.state = this.planeTransform;
  }

  componentDidMount() {
    this.setDimensionsAggregators();
    if (this.playMode())
      this.executePlayMode();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.height !== this.props.height ||
        prevProps.width !== this.props.width) {
      this.forceUpdate();
    } else if (prevProps.aggregators !== this.props.aggregators ||
               prevProps.dimensions !== this.props.dimensions ||
               prevProps.options.metrics !== this.props.options.metrics) {
      this.setDimensionsAggregators();
    }

    if(prevProps.originalRange !== this.props.originalRange ||
      prevProps.originalStartTime !== this.props.originalStartTime ||
      prevProps.originalEndTime !== this.props.originalEndTime ||
      prevProps.reloadTimestamp !== this.props.reloadTimestamp) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.initializeDates();
      this.playMode() && this.executePlayMode();
    }
  }

  initializeDates = () => {
    if (this.props.originalRange) {
      [this.startTime, this.endTime] = Time.rangeToDateTimes(this.props.originalRange);
    } else {
      this.startTime = Time.moment(this.props.originalStartTime);
      this.endTime   = Time.moment(this.props.originalEndTime);
    }
  }

  playMode = () => {
    const playModeEnabled = get(this.props, 'options.playMode.enabled');
    return playModeEnabled == undefined ? false : playModeEnabled;
  }

  playModeLegendEnabled = () => {
    return get(this.props, 'options.playMode.legend.enabled');
  }

  playModeLegendPosition = () => {
    return get(this.props, 'options.playMode.legend.position');
  }

  executePlayMode = () => {
    const cadence = get(this.props, 'options.playMode.cadence') || 1000;
    const { value, unit } = get(this.props, 'options.playMode.granularity') || { value: 1, unit: 'minute' };

    this.props.handleToUpdate(
      this.startTime.toISOString(),
      Time.moment(this.startTime).add(value, unit).toISOString()
    );

    this.timer = setTimeout(() => {
      this.startTime.add(value, unit).toISOString();

      if (this.startTime.isSameOrAfter(this.endTime))
        this.initializeDates();

      this.executePlayMode();
    }, cadence);
  }

  endTimePlayMode = () => {
    const { value, unit } = get(this.props, 'options.playMode.granularity') || { value: 1, unit: 'minute' };
    return Time.moment(this.startTime).add(value, unit);
  }

  // We have to wait until the image is loaded to retrieve the real width
  // and real height of the image.
  // The forceUpdate is needed because sometimes the data is caculated before
  // the image is loaded.
  handleImageLoaded() {
    this.forceUpdate();
  }

  setDimensionsAggregators() {
    [this.coordinate_field, this.grouped_dimensions, this.aggregators] =
      Locatable.getDimensionsAggregators(this.props.dimensions,
                                         this.props.aggregators,
                                         this.props.options);
  }

  getMainAggregator() {
    return this.props.options.threshold_metric || this.aggregators[0];
  }

  transformData(data) {
    return (
      data.filter((d) =>
        d[this.coordinate_field] !== null &&
        d[this.coordinate_field] !== "NaN,NaN"
      ).map((d) => {
        let latitude = d[this.coordinate_field].split(',')[0];
        let longitude = d[this.coordinate_field].split(',')[1];

        let {x, y} = gps_utils.translatePoint(latitude, longitude,
                                              this.image,
                                              this.props.options.gps_markers);

        return {
          x,
          y,
          dimensions: this.grouped_dimensions.map((dim) => {
            return {name: dim.name, value: d[dim.name]};
          }),
          aggregators: this.aggregators.map((agg) => {
            return {name: agg, real_value: d[agg], value: Format.prefix(d[agg], 2)};
          }),
        };
      }, this)
    );
  }

  get keepRatio() {
    return this.props.options.keep_ratio;
  }

  get imageURL() {
    return this.props.options.image;
  }

  get radius() {
    return get(this.props, 'options.radius') || 10;
  }

  get planeTransform() {
    return StorageCtrl.loadDetails('planeTransform', this.props.id) ||
      { scale: 1, translation: { x: 0, y:0 } }
  }

  changeZoom(obj) {
    this.scaleOffset = obj.scale - this.state.scale;
    StorageCtrl.persistDetails('planeTransform', this.props.id, obj);
    this.setState(obj);
  }

  tooltipPosition(node, width, height) {
    const node_x = node.attrs.x;
    const node_y = node.attrs.y;

    if (node_x < 100){
      return {x: node_x, y: node_y, pointerDirection: "left"};
    } else if(node_x > width - 100) {
      return {x: node_x, y: node_y, pointerDirection: "right"};
    } else if(node_y < 100){
      return {x: node_x, y: node_y, pointerDirection: "up"};
    } else {
      return {x: node_x, y: node_y, pointerDirection: "down"};
    }
  }

  tooltipText(node) {
    const dimensions = node.attrs.dimensions;
    const aggregators = node.attrs.aggregators;

    let text = [];

    dimensions.forEach((dimension) => {
      text.push(`${dimension.name}:\t${dimension.value}`);
    });

    aggregators.forEach((aggregator) => {
      text.push(`${aggregator.name}:\t${aggregator.value}`);
    });

    return text.join("\n");
  }

  showTooltip(evt) {
    const node = evt.target;
    if (node) {
      const tooltipPosition = this.tooltipPosition(node, this.props.width, this.props.height);
      this.refs.tooltip.setPosition({x: node.attrs.x, y: node.attrs.y});
      this.refs.tooltip.getTag().setPointerDirection(tooltipPosition.pointerDirection);
      this.refs.tooltip.getText().setText(this.tooltipText(node));
      this.refs.tooltip.show();
      this.refs.layer.batchDraw();
    }
  }

  hideTooltip(evt) {
    this.refs.tooltip.hide();
    this.refs.layer.batchDraw();
  }

  getColorFromThresholds(value) {
    const threshold = sortBy(this.props.options.thresholds, (t) => t[0])
                      .reverse()
                      .find((e) => value >= e[0]);
    if (threshold) return threshold[1];
    return DEFAULT_MARKER_COLOR;
  }

  getMarkerColor(marker) {
    if (this.props.options.thresholds == undefined)
      return DEFAULT_MARKER_COLOR;

    const main_aggregator = marker.aggregators.find((a) => (a.name == this.getMainAggregator()));
    if (main_aggregator) {
      return this.getColorFromThresholds(main_aggregator.real_value);
    } else {
      return DEFAULT_MARKER_COLOR;
    }
  }

  render () {
    if(this.props.error)
      return(<Info error={this.props.error} />)

    const data = this.transformData(this.props.data);

    const cssClassLegend = cs('play-mode-legend', {
      'play-mode-legend--bottom': this.playModeLegendPosition() == 'bottom'
    });

    const content = <WidgetImage
      width={this.image.clientWidth}
      height={this.image.clientHeight}
      keepRatio={this.keepRatio}
      image={this.imageURL}
      scale={this.state.scale}
      scaleOffset={this.scaleOffset !== 0}
      translation={this.state.translation}
      onLoad={this.handleImageLoaded.bind(this)}
      ref={(node) => {
        if (node) {
          this.image = node.image;
          this.scaleOffset = 0;
        } else {
          null
        }}}>
        <Stage
          width={this.image.clientWidth}
          height={this.image.clientHeight}>
          <Layer ref="layer">
            {
              data.map((element, index) => (
                <Circle
                  key={index}
                  {...element}
                  stroke="black"
                  fill={ this.getMarkerColor(element) }
                  strokeWidth={1}
                  radius={ this.radius }
                  onMouseOver={(e) => this.showTooltip(e)}
                  onMouseOut={(e) => this.hideTooltip(e)}
                />
              ))
            }
            <Label visible={false} ref="tooltip">
              <Tag
                fill="white"
                pointerDirection="down"
                pointerWidth={10}
                pointerHeight={10}
                cornerRadius={5}
                shadowColor="black"
                shadowBlur={10}
                shadowOffset={10}
                shadowOpacity={0.5}
              />
              <Text
                text=""
                padding={5}
                fill="black"
              />
            </Label>
          </Layer>
        </Stage>
    </WidgetImage>

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <MapInteraction
          scale={this.state.scale}
          defaultScale={1}
          minScale={0.75}
          maxScale={5}
          translation={this.state.translation}
          defaultTranslation={this.state.translation}
          onChange={(e) => this.changeZoom(e)}
          showControls
        >{
          ({ translation, scale }) => content
        }</MapInteraction>
        {
          this.playMode() && this.playModeLegendEnabled() ?
            <DateTimeInterval
              className={cssClassLegend}
              start_time={this.startTime.toISOString()}
              end_time={this.endTimePlayMode().toISOString()}
            /> : null
        }
      </div>
    )
  }
};

WidgetPlaneLocation.propTypes = {
  ...common.BASE,
  ...common.SIZE,
  aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimensions: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    ...common.PLANE,
    threshold_metric: PropTypes.string,
    thresholds: PropTypes.arrayOf(PropTypes.array),
    playMode: PropTypes.object,
    radius: PropTypes.number
  }),
  handleToUpdate: PropTypes.func,
  originalRange: PropTypes.string,
  originalStartTime: PropTypes.string,
  originalEndTime: PropTypes.string
};
