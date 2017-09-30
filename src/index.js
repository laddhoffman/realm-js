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
        <Box x={50} y={50}>
          <CameraInfoView cameraInfo={cameraInfo} />
        </Box>
        <Icosahedron cameraInfo={cameraInfo} />
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);


