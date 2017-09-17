import React from 'react';
import * as THREE from 'three';
import React3 from 'react-three-renderer';

class Simple extends React.Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.state = {
      cubeRotation: new THREE.Euler(),
    };

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        ),
      });
    };

    var i, j, k;
    this.lines = [];

    for (i = -10; i < 10; i++) {
      for (j = -10; j < 10; j++) {
        this.lines.push({
          vertices: [
            new THREE.Vector3(-10, i, j),
            new THREE.Vector3(10, i, j)
          ]
        });
        this.lines.push({
          vertices: [
            new THREE.Vector3(i, -10, j),
            new THREE.Vector3(i, 10, j)
          ]
        });
        this.lines.push({
          vertices: [
            new THREE.Vector3(i, j, -10),
            new THREE.Vector3(i, j, 10)
          ]
        });
      }
    }

  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    var lines = this.lines.map(line => {
      return (
        <line>
          <geometry
            vertices={line.vertices}
          />
          <lineBasicMaterial
            color={0x00ff00}
          />
        </line>
      )
    });

    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}
      clearColor={0xffffff}

      onAnimate={this._onAnimate}
    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}
          position={this.cameraPosition}
        />
        {lines}
      </scene>
    </React3>);
  }
}

export default class Something3d extends React.Component {
	render() {
    return (
      <Simple />
    );
  }
}
