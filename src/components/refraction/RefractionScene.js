"use client";
import { useFBO } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Slider, Typography } from '@mui/material';
import { useEffect, useState, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";

import refractVertexShader from "./shaders/RefractVertexShader.glsl";
import refractFragmentShader from "./shaders/RefractFragmentShader.glsl";
import gridVertexShader from "./shaders/GridVertexShader.glsl";
import gridFragmentShader from "./shaders/GridFragmentShader.glsl";

import styles from '@/styles/components/RefractionScene.module.css'

const createGrid = (backgroundGroup) => {
  const material = new THREE.ShaderMaterial({
    vertexShader: gridVertexShader,
    fragmentShader: gridFragmentShader,
    uniforms: {
      maxDistance: { value: 50.0 },
      lineWidth: { value: 1.0 }
    },
    transparent: true,
    depthWrite: false
  });
  
  const maxX = 150;
  const maxY = 150;
  const zPosition = -20;
  const originalGroup = new THREE.Group();

  const drawLine = (x1, y1, x2, y2, group) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, y1, zPosition),
      new THREE.Vector3(x2, y2, zPosition),
    ]);
    const line = new THREE.Line(geometry, material);
    group.add(line);
  }; 

  drawLine(maxX, 0, -maxX, 0, originalGroup);
  drawLine(0, maxY, 0, -maxY, originalGroup);

  const yFactor = (maxY / 2) * (maxX / 2);
  const numCurves = 80;
  const step = maxX / 500;

  const drawHyperbola = (signX, signY, group) => {
    for (let i = 0; i < numCurves; i++) {
      const points = [];
      let x = 0;
      while (x < maxX) {
        const y = (i * yFactor) / (numCurves * x);
        if (y > 0 && y < maxY) {
          points.push(new THREE.Vector3(signX * x, signY * y, zPosition));
        }
        x += step;
      }
      if (points.length > 1) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        group.add(line);
      }
    }
  }

  drawHyperbola(1, 1, originalGroup);
  drawHyperbola(1, -1, originalGroup);
  drawHyperbola(-1, 1, originalGroup);
  drawHyperbola(-1, -1, originalGroup);

  const rotatedGroup = originalGroup.clone();
  rotatedGroup.rotation.z = Math.PI / 4;

  backgroundGroup.add(originalGroup);
  backgroundGroup.add(rotatedGroup);
};

const Geometries = ({ uniforms, setUniforms, canvasSize }) => {
  const { camera, gl: renderer } = useThree();
  const backgroundGroup = useRef();
  const mainRenderTarget = useFBO();
  const icosahedronRefs = useRef([]);

  const icosahedrons = useMemo(() => [
    { position: new THREE.Vector3(-Math.sqrt(36 + 36), 0, -4), radius: 6, detail: 20 },
    { position: new THREE.Vector3(Math.sqrt(36 + 36), 0, -4), radius: 6, detail: 20 },
    { position: new THREE.Vector3(0, 6, 2), radius: 6, detail: 20 },
    { position: new THREE.Vector3(0, -6, -10), radius: 6, detail: 20 },
  ], []);

  const memoizedUniforms = useMemo(() => ({
    ...uniforms,
    uTexture: { value: null },
    winResolution: {
      value: new THREE.Vector2(canvasSize.width, canvasSize.height).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
    },
  }), [uniforms, canvasSize]);

  const rotationAxis = useMemo(() => new THREE.Vector3(0, -6, 6).normalize(), []);
  const centerPoint = useMemo(() => {
    const center = new THREE.Vector3();
    icosahedrons.forEach(({ position }) => center.add(position));
    return center.divideScalar(icosahedrons.length);
  }, [icosahedrons]);

  useEffect(() => createGrid(backgroundGroup.current), []);

  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        camera.aspect = canvasSize.width / canvasSize.height;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasSize.width, canvasSize.height);
        
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        mainRenderTarget.setSize(
          canvasSize.width * pixelRatio, 
          canvasSize.height * pixelRatio
        );
        
        setUniforms(prev => ({
          ...prev,
          winResolution: {
            value: new THREE.Vector2(canvasSize.width, canvasSize.height).multiplyScalar(pixelRatio),
          },
        }));
      }, 500); 
    };

    handleResize();

    return () => {
      clearTimeout(resizeTimer);
    };
  }, [camera, renderer, mainRenderTarget, setUniforms, canvasSize]);

  const lastTime = useRef(0);

  useFrame((state) => {
    const { gl, scene, camera, clock } = state;
    const currentTime = clock.getElapsedTime();
    const deltaTime = currentTime - lastTime.current;
    lastTime.current = currentTime;

    const rotationSpeed = 0.2;
    const angleIncrement = rotationSpeed * deltaTime;

    icosahedronRefs.current.forEach((mesh) => {
      if (mesh) {
        const rotationMatrix = new THREE.Matrix4().makeRotationAxis(rotationAxis, angleIncrement);
        const offset = mesh.position.clone().sub(centerPoint);
        offset.applyMatrix4(rotationMatrix);
        mesh.position.copy(centerPoint).add(offset);
        mesh.quaternion.setFromRotationMatrix(rotationMatrix);
      }
    });

    icosahedronRefs.current.forEach((mesh) => {
      if (mesh) mesh.material.visible = false;
    });

    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);

    icosahedronRefs.current.forEach((mesh) => {
      if (mesh && mesh.material && mesh.material.uniforms) {
        mesh.material.uniforms.uTexture.value = mainRenderTarget.texture;
        Object.entries(memoizedUniforms).forEach(([key, { value }]) => {
          if (mesh.material.uniforms[key]) {
            mesh.material.uniforms[key].value = value;
          }
        });
      }
    });

    gl.setRenderTarget(null);

    icosahedronRefs.current.forEach((mesh) => {
      if (mesh) mesh.material.visible = true;
    });
  });

  return (
    <>
      <color attach="background" args={["black"]} />
      <group ref={backgroundGroup}></group>
      {icosahedrons.map((icosahedron, index) => (
        <mesh 
          key={index} 
          position={icosahedron.position}
          ref={(el) => (icosahedronRefs.current[index] = el)}
        >
          <icosahedronGeometry args={[icosahedron.radius, icosahedron.detail]} />
          <shaderMaterial
            key={uuidv4()}
            vertexShader={refractVertexShader}
            fragmentShader={refractFragmentShader}
            uniforms={memoizedUniforms}
          />
        </mesh>
      ))}
    </>
  );
};

const SliderComponent = ({ label, value, onChange, min, max, step, width, height, color }) => {
  return (
    <div className={styles.sliderComponent}>
      <Typography sx={{ fontFamily: 'var(--font-gilgan), sans-serif', fontSize: '10pt', color: 'black' }}>
        {label}
      </Typography>
      <Slider
        value={value}
        onChange={onChange}
        aria-labelledby={`${label}-slider`}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        orientation="horizontal"
        sx={{
          width: width,
          height: height,
          color: color,
          '& .MuiSlider-track': {
            backgroundColor: color,
          },
          '& .MuiSlider-thumb': {
            backgroundColor: color,
          },
        }}
      />
    </div>
  );
};

const SliderContainer = ({ uniforms, handleUniformChange }) => {
  const sliderGroups = [
    [
      { label: 'Red Index of Refraction', uniformKey: 'uIorR', color: 'red', min: 1, max: 3, step: 0.01 },
      { label: 'Green Index of Refraction', uniformKey: 'uIorG', color: 'green', min: 1, max: 3, step: 0.01 },
      { label: 'Blue Index of Refraction', uniformKey: 'uIorB', color: 'blue', min: 1, max: 3, step: 0.01 },
    ],
    [
      { label: 'Cyan Index of Refraction', uniformKey: 'uIorC', color: 'cyan', min: 1, max: 3, step: 0.01 },
      { label: 'Yellow Index of Refraction', uniformKey: 'uIorY', color: 'yellow', min: 1, max: 3, step: 0.01 },
      { label: 'Purple Index of Refraction', uniformKey: 'uIorP', color: 'magenta', min: 1, max: 3, step: 0.01 },
    ],
    [
      { 
        label: 'Refraction Power', 
        uniformKey: 'uRefractPower', 
        color: 'grey', 
        min: 0, 
        max: 3, 
        step: 0.01 
      },
      { 
        label: 'Chromatic Aberration', 
        uniformKey: 'uChromaticAberration', 
        color: 'grey', 
        min: 0, 
        max: 1, 
        step: 0.01 
      },
      { 
        label: 'Saturation', 
        uniformKey: 'uSaturation', 
        color: 'grey', 
        min: 0.5, 
        max: 1.1, 
        step: 0.01 
      },
    ],
  ];

  return (
    <div className={styles.sliderContainer}>
      {sliderGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.sliderGroup}>
          {group.map((slider) => (
            uniforms[slider.uniformKey] && (
              <SliderComponent
                key={slider.uniformKey}
                label={slider.label}
                value={uniforms[slider.uniformKey].value}
                onChange={handleUniformChange(slider.uniformKey)}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                width="100%"
                height="10%"
                color={slider.color}
              />
            )
          ))}
        </div>
      ))}
    </div>
  );
};

const RefractionScene = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = window.innerHeight;

        setCanvasSize({
          width: containerWidth,
          height: containerHeight
        });
      }
    };

    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);
  
  const [uniforms, setUniforms] = useState({
    uIorR: { value: 1.12 },
    uIorG: { value: 1.13 },
    uIorB: { value: 1.14 },
    uIorC: { value: 1.15 },
    uIorY: { value: 1.16 },
    uIorP: { value: 1.17 },
    uRefractPower: { value: 1.59 },
    uChromaticAberration: { value: 0.30 },
    uSaturation: { value: 1.02 },
  });

  const handleUniformChange = (key) => (event, newValue) => {
    setUniforms(prevUniforms => ({
      ...prevUniforms,
      [key]: { value: newValue }
    }));
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {canvasSize.width > 0 && canvasSize.height > 0 && (
        <Canvas
          style={{ width: canvasSize.width, height: canvasSize.height }}
          camera={{ position: [0, 0, 40] }}
          dpr={[1, 10]}
        >
          <Geometries 
            uniforms={uniforms} 
            setUniforms={setUniforms} 
            canvasSize={canvasSize}
          />
        </Canvas>
      )}
      <SliderContainer uniforms={uniforms} handleUniformChange={handleUniformChange} />
    </div>
  );
};

export default RefractionScene;