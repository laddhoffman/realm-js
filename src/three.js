'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import React3 from 'react-three-renderer';
import * as _ from 'lodash';
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import TrackballControls from './ref/trackball';

const Icosahedron = observer(class Icosahedron extends React.Component {
  constructor(props, context) {
    super(props, context);

    console.log('Icosahedron constructor(), this.props:', JSON.stringify(this.props, null, 2));

    this.state = {
      cameraPosition: new THREE.Vector3(-5.722, 7.681, 2.875),
    };

    this.props.cameraInfo.position = this.state.cameraPosition;

    this.lightPositions = [
      new THREE.Vector3(-10, -10, -10),
      new THREE.Vector3(-10, -10, 10),
      new THREE.Vector3(-10, 10, -10),
      new THREE.Vector3(-10, 10, 10),
      new THREE.Vector3(10, -10, -10),
      new THREE.Vector3(10, -10, 10),
      new THREE.Vector3(10, 10, -10),
      new THREE.Vector3(10, 10, 10),
    ];
    this.lightTarget = new THREE.Vector3(0, 0, 0);

    this._onAnimate = () => {
      // we will get this callback every frame
      this.controls.update();
    };

    /* a cubic lattice */
    this.lines = [];
//     var i, j, k;
//     for (i = -10; i <= 10; i++) {
//       for (j = -10; j <= 10; j++) {
//         this.lines.push({
//           vertices: [
//             new THREE.Vector3(-10, i, j),
//             new THREE.Vector3(10, i, j)
//           ]
//         });
//         this.lines.push({
//           vertices: [
//             new THREE.Vector3(i, -10, j),
//             new THREE.Vector3(i, 10, j)
//           ]
//         });
//         this.lines.push({
//           vertices: [
//             new THREE.Vector3(i, j, -10),
//             new THREE.Vector3(i, j, 10)
//           ]
//         });
//       }
//     }

    // let's draw an icosahedron frame.
    // there's a built-in method to get the vertex locations of an icosahedron.
    // we can start with that and then work on drawwing the wireframe.
    var radius = 5;
    var icosahedron = new THREE.IcosahedronGeometry(radius);
    var vertices = icosahedron.vertices;

    // We can try drawing points now
    this.points = {};
    this.points['green'] = vertices;

    // OK, now let's see if we can identify the (5) nearest neighbors of each pt
    var edges = [];
    vertices.forEach(v1 => {
      let index1 = vertices.indexOf(v1);
      // get distance to each other vertex
      let neighbors = _.chain(vertices)
        .filter(v2 => {
          return vertices.indexOf(v1) !== vertices.indexOf(v2);
        })
        .map(v2 => {
          let index2 = vertices.indexOf(v2);
          // console.log('vertex', index1, v1, 'to', index2, v2, 'dist:', v1.distanceTo(v2));
          return {
            dist: v1.distanceTo(v2),
            index: index2,
            vertex: v2
          };
        })
        // sort and select the 5 nearest neighbors
        .sortBy(['dist'])
        .value();
      // console.log('vertex', index1, 'neighbors:', JSON.stringify(neighbors));

      // Connect to 5 nearest neighbors with blue
      neighbors.slice(0,5).forEach(neighbor => {
        let index2 = neighbor.index;
        edges.push({
          index1,
          index2,
          v1,
          v2: neighbor.vertex,
          color: 'blue'
        });
      });

      // Connect to the next 5 nearest neighbors with red
      neighbors.slice(5,10).forEach(neighbor => {
        let index2 = neighbor.index;
        edges.push({
          index1,
          index2,
          v1,
          v2: neighbor.vertex,
          color: 'darkred'
        });
      });
    });
    // console.log('edges:', JSON.stringify(edges));

    // Each edge will have been counted twice
    edges = _.uniqBy(edges, edge => {
      return [edge.index1, edge.index2].sort().join('-');
    });
    // console.log('unique edges:', JSON.stringify(edges));

    this.points2 = [];

    // Now, draw the lines
    edges.forEach(edge => {
      this.lines.push({
        v1: edge.v1,
        v2: edge.v2,
        color: edge.color
      });

      let v = edge.v2.clone().sub(edge.v1);
      let center = edge.v1.clone().add(v.divideScalar(2));

      this.points[edge.color] = this.points[edge.color] || [];
      this.points[edge.color].push(center);
    });
  }

  componentDidMount() {
    const controls = new TrackballControls(this.refs.mainCamera,
ReactDOM.findDOMNode(this.refs.react3));

    controls.rotateSpeed = 10.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    // todo: make this listener an observer?
    controls.addEventListener('change', () => {
      this.setState({
        cameraPosition: this.refs.mainCamera.position,
      });
      this.props.cameraInfo.position = this.refs.mainCamera.position;
      console.log(JSON.stringify(this.props.cameraInfo.position));
    });

    this.controls = controls;
  }

  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    var lines = this.lines.map((line, index) => {
      let key = 'line-' + index;
      let v = line.v2.clone().sub(line.v1);
      let length = v.length();
      let q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        v.clone().normalize()
      );
      let direction = new THREE.Euler().setFromQuaternion(q);
      let center = line.v1.clone().add(v.divideScalar(2));
      let radius = 0.067;
      return (
        <mesh key={key}
          position={center}
          rotation={direction}
        >
          <cylinderGeometry
            height={length}
            radiusTop={radius}
            radiusBottom={radius}
            radialSegments={4}
          />
          <meshLambertMaterial
            color={line.color}
          />
        </mesh>
      );
      /*
      return (
        <line key={key}>
          <geometry
            vertices={[line.v1, line.v2]}
          />
          <lineBasicMaterial
            color={line.color}
          />
        </line>
      );
      */
    });

    var points = Object.keys(this.points).map(color => {
      return (
        <points key={'points-' + color}>
          <geometry
            vertices={this.points[color]}
          />
          <pointsMaterial
            color={color}
          />
        </points>
      );
    });

    return (<React3
      ref="react3"
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}
      alpha={true}
      clearAlpha={0}
      clearColor={0xffffff}
      antialias

      onAnimate={this._onAnimate}
    >
      <scene>
        <perspectiveCamera
          ref="mainCamera"
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}
          position={this.state.cameraPosition}
        />

        <ambientLight
          color={0xffffff}
          intensity={0.2}
        />

        {
          this.lightPositions.map((lightPosition, index) => {
            return (
              <directionalLight
                key={'light-' + index}
                color={0xffffff}
                intensity={0.35}

                castShadow

                shadowMapWidth={1024}
                shadowMapHeight={1024}

                position={lightPosition}
                lookAt={this.lightTarget}
              />
            );
          })
        }

        {lines}

        {/*points*/}

      </scene>
    </React3>);
  }
});

// Mobx observable data store
class CameraInfo {
  constructor() {
    extendObservable(this, {
      position: new THREE.Vector3(0, 0, 0),
    });
  }
};

const CameraInfoView = observer(class CameraInfoView extends React.Component {
  render() {
    if (this.props.cameraInfo.position === null) {
      return (
        <div>
          No camera position data
          <br />
        </div>
      );
    }
    return (
      <div>
        Camera x: {this.props.cameraInfo.position.x}
        <br />
        Camera y: {this.props.cameraInfo.position.y}
        <br />
        Camera z: {this.props.cameraInfo.position.z}
        <br />
      </div>
    );
  }
});

export {
  Icosahedron,
  CameraInfo,
  CameraInfoView,
};
