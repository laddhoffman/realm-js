import React from 'react';

export default class Box extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='box'
        style={{
          position: 'absolute',
          left: this.props.x,
          top: this.props.y,
        }}>
        some content
      </div>
    );
  }
}
