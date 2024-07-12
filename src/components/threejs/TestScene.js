"use client"
import { Float, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

//import VertexShader from "./VertexShader";
//import FragmentShader from "./FragmentShader";
//import BirdVertexShader from "./BirdVertexShader";
//import BirdFragmentShader from "./BirdFragmentShader"; 
//import PositionFragmentShader from "./PositionFragmentShader"; 
//import VelocityFragmentShader from "./VelocityFragmentShader"; 


function generatePoints(count, radius) {
  const positions = new Float32Array(count * 3);
  const phi = Math.PI * (Math.sqrt(5.0) - 1); // Golden angle in radians.

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;        // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y);     // radius at y
    const theta = phi * i;                      // golden angle increment
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    // Set the position of the point in the positions array
    positions.set([x * radius, y * radius, z * radius], i * 3);
  }

  return positions;
}

const CustomGeometryParticles = (props) => {
  const { count } = props;
  const globalRadius = 2;
  const { camera } = useThree(); 

  // This reference gives us direct access to our points
  const points = useRef();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const spheres = 10;
    const pointsPerVolume = count / ((4/3) * Math.PI * Math.pow(globalRadius, 3));

    let allPositions = []; 

    for (let j = 1; j <= spheres; j++) {
      const layerRadius = globalRadius * (j / spheres); 
      const layerVolume = ((4/3) * Math.PI * Math.pow(layerRadius, 3)) - ((4/3) * Math.PI * Math.pow(layerRadius - (globalRadius * ((j-1) / spheres)), 3));
      const layerPoints = Math.round(layerVolume * pointsPerVolume); 
      const layerPositions = generatePoints(layerPoints, layerRadius); 
      allPositions = allPositions.concat(Array.from(layerPositions)); 
    }

    const positions = new Float32Array(allPositions); 
    return positions; 
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0
    },
    uRadius: {
      value: globalRadius
    }, 
    uSeparationDistance: {
      value: 20.0
    }, 
    uAlignmentDistance: {
      value: 40.0
    }, 
    uCohesionDistance: {
      value: 50.0
    }, 
    uFreedomFactor: {
      value: 0.75
    }, 
    uPredator: {
      value: new THREE.Vector3()
    }
  }), [])

  useFrame((state) => {
    const { clock } = state;
    points.current.material.uniforms.uTime.value = clock.elapsedTime;
    console.log("Camera FOV:", camera.fov); 
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={FragmentShader}
        vertexShader={VertexShader}
        uniforms={uniforms}
      />
      
    </points>
  );
};

/* 
<shaderMaterial
  blending={THREE.AdditiveBlending}
  depthWrite={false}
  fragmentShader={PositionFragmentShader}
  vertexShader={VertexShader}
  uniforms={uniforms}
/>
<shaderMaterial
  blending={THREE.AdditiveBlending}
  depthWrite={false}
  fragmentShader={VelocityFragmentShader}
  vertexShader={VertexShader}
  uniforms={uniforms}
/>
<shaderMaterial
  blending={THREE.AdditiveBlending}
  depthWrite={false}
  fragmentShader={BirdFragmentShader}
  vertexShader={BirdVertexShader}
  uniforms={uniforms}
/>
*/


const Scene = () => {
  return (
    <Canvas camera={{ position: [2.0, 2.0, 2.0] }}>
      <ambientLight intensity={0.5} />
      <CustomGeometryParticles count={2000} />
      <OrbitControls />
    </Canvas>
  );
};


export default Scene;


