"use client"
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Slider, Typography } from '@mui/material';

import Octree from '@/utils/Octree';

import VertexShader from './shaders/VertexShader.glsl';
import FragmentShader from './shaders/FragmentShader.glsl';

const generateRandomCoordinates = (count, range) => {
    const coordinates = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const x = Math.random() * range - range / 2;
        const y = Math.random() * range - range / 2;
        const z = Math.random() * range - range / 2;
        const index = i * 3;
        coordinates.set([x, y, z], index);
    }
    return coordinates;
};

const GenerateLayer = (count, radius) => {
    const positions = []; // Initialize positions array as an empty array

    const phi = Math.PI * (Math.sqrt(5.0) - 1); 

    for (let i = 0; i < count; i++) {
        if (count > 1) {
            const y = 1 - (i / (count - 1)) * 2; 
            const radiusAtY = Math.sqrt(1 - y * y); 
            const theta = phi * i; 
            const x = Math.cos(theta) * radiusAtY; 
            const z = Math.sin(theta) * radiusAtY; 

            positions.push(x * radius, y * radius, z * radius); // Push x, y, and z positions to the array
        }
    }

    if (count === 1) {
        positions.push(0, 0, 0); 
    }

    return new Float32Array(positions); // Convert positions array to Float32Array
}

const GenerateSphere = (count, spheres, globalRadius) => {
    let allPositions = []
    const pointDensity = count / ((4/3) * Math.PI * Math.pow(globalRadius, 3));
    const radiusIncrement = globalRadius / spheres; 

    for (let i = 1; i <= spheres; i++) {
        const layerRadius = i * radiusIncrement; 
        const prevLayerRadius = (i-1) * radiusIncrement; 
        const layerVolume = ((4/3) * Math.PI * Math.pow(layerRadius, 3)) - ((4/3) * Math.PI * Math.pow(prevLayerRadius, 3));
        const layerPoints = Math.ceil(layerVolume * pointDensity);
        const layerPositions = GenerateLayer(layerPoints, layerRadius);
        allPositions = allPositions.concat(Array.from(layerPositions));
    }

    allPositions = allPositions.slice(0, count * 3); 
    return new Float32Array(allPositions);
}

const getLineSegments = (octree) => {
    const lineSegments = []; 
    const corners = octree.getAllBoundingBoxCorners(); 
    for (let i = 0; i < corners.length; i++) {
        lineSegments.push(corners[i].x, corners[i].y, corners[i].z); 
    }
    return new Float32Array(lineSegments); 
}

const getLineIndices = (positions) => {
    const indices = []; 

    const cubes = positions.length / 24; 
    for (let i = 0; i < cubes; i++) {
        const j = 8 * i; 
        indices.push(
            j, j+1,
            j+1, j+2, 
            j+2, j+3, 
            j+3, j, 
            j, j+4, 
            j+1, j+5, 
            j+2, j+6, 
            j+3, j+7, 
            j+4, j+5, 
            j+5, j+6, 
            j+6, j+7, 
            j+7, j+4 
        )
    }
    return new Uint32Array(indices); 
}

const ThreeScene = ({ count, searchRadius }) => {
    const radius = 10;

    const containerRef = useRef();
    const sceneRef = useRef();
    const cameraRef = useRef();
    const rendererRef = useRef();
    const particleSystemRef = useRef();
    const boundingBoxesRef = useRef(); 
    const octreeRef = useRef(); 
    const searchRadiusRef = useRef(searchRadius); 

    useEffect(() => {
        searchRadiusRef.current = searchRadius;
    }, [searchRadius])

    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 35;
        camera.position.y = 20;
        const renderer = new THREE.WebGLRenderer();
        const controls = new OrbitControls(camera, renderer.domElement);
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onWindowResize);

        const direction = new THREE.Vector3(
            Math.random() * 2 - 1, 
            Math.random() * 2 - 1, 
            Math.random() * 2 - 1
        ).normalize(); 
        const velocity = direction.multiplyScalar(5); 

        // Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);

            const deltaTime = clock.getDelta();

            if (particleSystemRef.current) {
                particleSystemRef.current.material.uniforms.uTime.value += deltaTime; 

                const x = particleSystemRef.current.geometry.attributes.position.array[0];
                const y = particleSystemRef.current.geometry.attributes.position.array[1];
                const z = particleSystemRef.current.geometry.attributes.position.array[2];

                if (Math.sqrt((x * x) + (y * y) + (z * z)) >= radius) {
                    velocity.negate(); 
                }

                // new coordinate (newX, newY, newZ) = current coordinate + velocity vector * deltaTime
                const newX = x + velocity.x * deltaTime; 
                const newY = y + velocity.y * deltaTime; 
                const newZ = z + velocity.z * deltaTime;

                const neighbors = octreeRef.current.searchNeighbors(new THREE.Vector3(x, y, z), searchRadiusRef.current);
                console.log(neighbors);
                particleSystemRef.current.geometry.attributes.neighbor.array.fill(0); 
                particleSystemRef.current.geometry.attributes.neighbor.array[0] = 1; 
                neighbors.forEach(neighbor => {
                    const index = neighbor.w; 
                    particleSystemRef.current.geometry.attributes.neighbor.array[index] = 1.0;
                });  

                particleSystemRef.current.geometry.attributes.position.array[0] = newX;
                particleSystemRef.current.geometry.attributes.position.array[1] = newY;
                particleSystemRef.current.geometry.attributes.position.array[2] = newZ;

                particleSystemRef.current.material.uniforms.uTime.value += deltaTime;
                particleSystemRef.current.geometry.attributes.neighbor.needsUpdate = true;
                particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Initialize random particle positions and velocities
        const particlesPosition = GenerateSphere(count, 20, radius);

        // Create or update Octree
        const octreeSize = radius * 1.5;
        const min = new THREE.Vector3(-octreeSize, -octreeSize, -octreeSize);
        const max = new THREE.Vector3(octreeSize, octreeSize, octreeSize);
        const octree = new Octree(min, max, 16);
        for (let i = 0; i < particlesPosition.length; i += 3) {
            const point = new THREE.Vector4(
                particlesPosition[i],
                particlesPosition[i + 1],
                particlesPosition[i + 2],
                i / 3
            );
            octree.insert(point);
        }
        octreeRef.current = octree;

        const firstPoint = new THREE.Vector3(particlesPosition[0], particlesPosition[1], particlesPosition[2]);
        const neighbors = octree.searchNeighbors(firstPoint, searchRadius);

        const particlesNeighbor = new Float32Array(count).fill(0);
        neighbors.forEach(neighbor => {
            const index = neighbor.w;
            particlesNeighbor[index] = 1.0;
        });
        const linesPosition = getLineSegments(octree);
        const linesIndex = getLineIndices(linesPosition);

        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesPosition, 3, false));
        pointGeometry.setAttribute('neighbor', new THREE.Float32BufferAttribute(particlesNeighbor, 1, false).setUsage(THREE.DynamicDrawUsage));
        const pointShaderMaterial = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0.0 }, uRadius: { value: radius }},
            vertexShader: VertexShader,
            fragmentShader: FragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const particleSystem = new THREE.Points(pointGeometry, pointShaderMaterial);
        if (particleSystemRef.current) {
            sceneRef.current.remove(particleSystemRef.current);
        }
        
        const lineGeometry = new THREE.BufferGeometry(); 
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linesPosition, 3, false)); 
        lineGeometry.setIndex(new THREE.BufferAttribute(linesIndex, 1, false));
        const lineShaderMaterial = new THREE.MeshBasicMaterial({
            color: 0x003366, 
            transparent: true, 
            opacity: 0.5
        });
        const octreeBoundingBoxes = new THREE.LineSegments(lineGeometry, lineShaderMaterial); 
        if (boundingBoxesRef.current) {
            sceneRef.current.remove(boundingBoxesRef.current);
        }

        sceneRef.current.add(octreeBoundingBoxes);
        boundingBoxesRef.current = octreeBoundingBoxes;

        sceneRef.current.add(particleSystem);
        particleSystemRef.current = particleSystem;

    }, [count, searchRadius]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}/>;
};

const OctreeScene = () => {
    const [count, setCount] = useState(10000);
    const [searchRadius, setSearchRadius] = useState(5);

    const handleCountChange = (event, newValue) => {
        setCount(newValue);
    };

    const handleSearchRadiusChange = (event, newValue) => {
        setSearchRadius(newValue);
    };

    return (
        <div>
            <div>
                <ThreeScene count={count} searchRadius={searchRadius} />
            </div>
            <div
                style={{
                    position: 'relative',
                    bottom: 20, // Distance from the bottom of the screen
                    left: '50%',
                    transform: 'translateX(-50%)', // Center the container horizontally
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '20px', // Space between sliders
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
                    borderRadius: '10px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography id="count-slider" gutterBottom>
                        Particle Count
                    </Typography>
                    <Slider
                        value={count}
                        onChange={handleCountChange}
                        aria-labelledby="count-slider"
                        min={0}
                        max={10000}
                        step={1}
                        valueLabelDisplay="auto"
                        orientation="horizontal"
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography id="searchRadius-slider" gutterBottom>
                        Search Radius
                    </Typography>
                    <Slider
                        value={searchRadius}
                        onChange={handleSearchRadiusChange}
                        aria-labelledby="searchRadius-slider"
                        min={1}
                        max={11}
                        step={0.2}
                        valueLabelDisplay="auto"
                        orientation="horizontal"
                    />
                </div>
            </div>
        </div>
    );
};

export default OctreeScene; 