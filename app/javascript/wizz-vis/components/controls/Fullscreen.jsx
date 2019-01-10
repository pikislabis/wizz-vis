/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';

function launchFullscreen(obj) {
  var fs = true;
  if (obj.requestFullscreen) {
    obj.requestFullscreen();
  } else if (obj.mozRequestFullScreen) {
    obj.mozRequestFullScreen();
  } else if (obj.webkitRequestFullscreen) {
    obj.webkitRequestFullscreen();
  } else if (obj.msRequestFullscreen) {
    obj.msRequestFullscreen();
  } else {
    console.log('Fullscreen Unavailable');
    fs = !fs;
  }

  if (fs)
    $('#fsSection').addClass('fullscreen');
    $('.fs-logo').css('display', 'block');
}

function exitFSHandler() {
  if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
    $('#fsSection').removeClass('fullscreen');
    $('.fs-logo').css('display', 'none');
  }
}

export default class Fullscreen extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    var fsSection = document.getElementById('fsSection');
    var fsBtn = document.getElementById('fsBtn');

    if (fsBtn !== null) {
      fsBtn.onclick = function() {
        launchFullscreen(fsSection);
      };
    }

    if (document.addEventListener) {
      document.addEventListener('webkitfullscreenchange', exitFSHandler, false);
      document.addEventListener('mozfullscreenchange', exitFSHandler, false);
      document.addEventListener('fullscreenchange', exitFSHandler, false);
      document.addEventListener('MSFullscreenChange', exitFSHandler, false);
    }
  }

  render() {
    return(
      <span>
        <a href="#" id='fsBtn'>
          <i className="material-icons">fullscreen</i> Fullscreen
        </a>
      </span>
    );
  }
}
