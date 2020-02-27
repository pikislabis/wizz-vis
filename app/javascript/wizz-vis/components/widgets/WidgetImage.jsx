/* jshint esversion: 6 */
import React from 'react';
import PropTypes from 'prop-types';
import ImageLink from './../ImageLink';
import get from 'lodash/get';

export default class WidgetImage extends React.Component {
  componentDidUpdate() {
    if (this.props.scaleOffset)
      setTimeout(this.props.onLoad, 50);
  }

  get keepRatio() {
    return this.props.keepRatio || get(this.props, 'options.keep_ratio');
  }

  get imageURL() {
    return this.props.image || get(this.props, 'options.image');
  }

  get opacity() {
    return this.props.opacity || get(this.props, 'options.opacity');
  }

  get onLoad() {
    return this.props.onLoad;
  }

  get scalePercent() {
    return (100 * this.props.scale).toString().concat('%');
  }

  offset(type) {
    return this.props.translation[type].toString().concat('px');
  }

  render() {
    let style = { position: 'absolute', top: 0, left: 0 };

    if (this.props.scale) {
      style = {...style, width: this.scalePercent, height: this.scalePercent,
               top: this.offset('y'), left: this.offset('x')};
    } else if (this.keepRatio) {
      style = {...style, top: '50%', left: '50%',
               transform: 'translate(-50%, -50%)',
               maxWidth: '100%', maxHeight: '100%',
               height: 'auto'};
    } else {
      style = {...style, width: '100%', height: '100%',
               opacity: this.opacity};
    }

    return (
      <div>
        {
          (this.props.options || {})["image-link"] !== undefined ?
            <ImageLink imageURL={this.imageURL}
                       linkURL={this.props.options["image-link"].url}
                       linkType={this.props.options["image-link"].type}
                       style={style} /> :
            <img
              ref={(image) => { this.image = image; }}
              style={style}
              src={this.imageURL}
              onLoad={this.onLoad}
            />
        }
        {
          this.props.width > 0 && this.props.height > 0 && (this.props.children !== undefined) ?
            <div style={{...style, width: this.props.width, height: this.props.height}}>
              {this.props.children}
            </div>
          : null
        }
      </div>
    )
  }
};

WidgetImage.propTypes = {
  options: PropTypes.shape({
    image: PropTypes.string,
    keep_ratio: PropTypes.bool,
    opacity: PropTypes.string,
    imageLink: PropTypes.object,
    translation: PropTypes.object,
    scale: PropTypes.number,
    scaleOffset: PropTypes.bool,
    onLoad: PropTypes.function
  })
};
