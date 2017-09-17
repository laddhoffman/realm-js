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
        <Something3d />
        <Box x='50' y='50'/>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);


