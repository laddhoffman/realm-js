import React from 'react';
import ReactDOM from 'react-dom';

import Box from './box';
import {Icosahedron, CameraInfo, CameraInfoView} from './three';

const cameraInfo = new CameraInfo();
console.log('cameraInfo:', cameraInfo);

class Page extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Icosahedron cameraInfo={cameraInfo} />
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);


