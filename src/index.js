import React from 'react';
import ReactDOM from 'react-dom';

import Box from './box';
import Something3d from './three';

class Page extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Box x={50} y={50}/>
        <Something3d />
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);


