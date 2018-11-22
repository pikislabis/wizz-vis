/* jshint esversion: 6 */

import React from 'react';
import {Marker} from 'react-leaflet';
import PropTypes from 'prop-types';

export default class ImageLink extends React.Component {
  get linkType () {
    if (this.props.linkType == 'absolute') {
      return '_blank';
    } else {
      return '_self';
    }
  }

  get linkURL() {
    if (this.props.linkURL == 'back') {
      return 'javascript:history.back();';
    } else {
      return this.props.linkURL;
    }
  }

  render () {
    return (
      <a href={this.linkURL}
         target={ this.linkType }>
        <img
          style={this.props.style}
          src={this.props.imageURL}
        />
      </a>
    );
  }
}

ImageLink.propTypes = {
  imageURL: PropTypes.string,
  linkURL: PropTypes.string,
  linkType: PropTypes.oneOf(['absolute', 'dashboard']),
  style: PropTypes.object
};
