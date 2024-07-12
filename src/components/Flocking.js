"use client"
import { Float, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState, useRef } from "react";
import * as THREE from "three";

import Octree from "@utils/Octree";
import OctreeBoundingBoxes from "./OctreeRender";


const VertexShader = `
uniform float uTime;
uniform float uRadius;

varying float vDistance;

void main() {
    vec3 newPosition = position;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 500.0;
    gl_PointSize *= (1.0 / - viewPosition.z);
}
`

const FragmentShader = `
uniform bool uIsNeighboring; 

void main() {
    vec3 color = vec3(0.34, 0.53, 0.96); 
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 3.0);

    if (uIsNeighboring) {
        color = vec3(1.0, 0.0, 0.0); 
    }

    color = mix(vec3(0.0), color, strength);
    gl_FragColor = vec4(color, strength);
}
`

// Computes the separation force that points which are within a specified radius exert on each other. 
const computeSeparation = (index, positions, separationDistance, separationFactor) => {
    let numToAvoid = 0; 
    const separationVelocity = new THREE.Vector3(); 

    const currPosition = new THREE.Vector3(
        positions[index * 3], 
        positions[index * 3 + 1], 
        positions[index * 3 + 2]
    )
    
    // Loop through points TODO: need to find faster way of searching for neighboring points. 
    for (let i = 0; i < positions.length; i +=3) {
        if (i === index * 3) continue; 

        const otherPosition = new THREE.Vector3(
            positions[i], 
            positions[i + 1], 
            positions[i + 2]
        )

        const dist = currPosition.distanceTo(otherPosition); 

        // Check if other point is within separationDistance of the current point. 
        if (dist < separationDistance) {
            const otherToCurr = currPosition.clone().sub(otherPosition);
            const normalizedDir = otherToCurr.clone().normalize();

            // Scale the direction based on how far the other point is.
            normalizedDir.divideScalar(dist); 

            // Accumulate separation velocity
            separationVelocity.add(normalizedDir); 

            // Keep track of how many points are in the separation range.
            numToAvoid++; 
        }
    }

    if (numToAvoid === 0) {
        return separationVelocity; 
    }

    // Scale velocity down by number of points in the separation range.
    separationVelocity.divideScalar(numToAvoid); 

    // Tune the velocity based on the customizable separationFactor.
    separationVelocity.multiplyScalar(separationFactor); 

    return separationVelocity; 
}

const computeCohesion = (index, positions, cohesionDistance, cohesionFactor) => {
    let numToAttract = 0; 
    const positionToMoveTowards = new THREE.Vector3(); 
    const currPosition = new THREE.Vector3(
        positions[index * 3], 
        positions[index * 3 + 1], 
        positions[index * 3 + 2]
    ); 
    
    // Loop through points TODO: need to find a faster way of searching through points.
    for (let i = 0; i < positions.length; i +=3) {
        if (i === index * 3) continue; 

        const otherPosition = new THREE.Vector3(
            positions[i], 
            positions[i + 1], 
            positions[i + 2]
        ); 

        const dist = currPosition.distanceTo(otherPosition); 

        // Check if the other point is within cohesionDistance of the current point. 
        if (dist < cohesionDistance) {

            // Accumulate positions of all other points within the range. 
            positionToMoveTowards.add(otherPosition); 
            numToAttract++; 
        }
    }

    if (numToAttract === 0) {
        return new THREE.Vector3(0, 0, 0); 
    }

    // Calculate the position to move towards (average position of neighbors). 
    positionToMoveTowards.divideScalar(numToAttract); 
    
    // Calculate the direction from the current point's position to the center of the flock. 
    const cohesionDirection = positionToMoveTowards.clone().sub(currPosition).normalize(); 

    // Tune the velocity based on the customizable cohesionFactor. 
    const cohesionVelocity = cohesionDirection.clone().multiplyScalar(cohesionFactor); 

    return cohesionVelocity; 
}

const computeAlignment = (index, positions, velocities, alignmentDistance, alignmentFactor) => {
    let numToAlign = 0; 
    const alignmentVelocity = new THREE.Vector3();
    const currPosition = new THREE.Vector3(
        positions[index * 3], 
        positions[index * 3 + 1], 
        positions[index * 3 + 2], 
    ); 

    for (let i = 0; i < positions.length; i +=3) {
        if (i === index * 3) continue; 

        const otherVelocity = new THREE.Vector3(
            velocities[i], 
            velocities[i + 1], 
            velocities[i + 2]
        ); 

        const otherPosition = new THREE.Vector3(
            positions[i], 
            positions[i + 1], 
            positions[i + 2]
        );

        const dist = currPosition.distanceTo(otherPosition); 

        // Check if the other point is within alignmentDistance of the current point.
        if (dist < alignmentDistance) {

            // Increment the alignment velocity based on the other point's velocity. 
            alignmentVelocity.add(otherVelocity); 
            numToAlign++; 
        }
    }

    if (numToAlign === 0) {
        return new THREE.Vector3(0, 0, 0);
    }

    // Average the alignment velocity of all other points in the alignment range. 
    alignmentVelocity.divideScalar(numToAlign); 

    // Tune the velocity based on the customizable alignmentFactor. 
    alignmentVelocity.normalize().multiplyScalar(alignmentFactor);

    return alignmentVelocity; 
}

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

const SphereGeometryParticles = (props) => {
    const {count, globalRadius, separationDistance, cohesionDistance, alignmentDistance,
            separationFactor, cohesionFactor, alignmentFactor } = props;
    

    const points = useRef();
    const particlesPosition = useRef(GenerateSphere(count, 10, globalRadius));
    
    
    // Create octree
    const min = new THREE.Vector3(-globalRadius - 0.5, -globalRadius - 0.5, -globalRadius - 0.5); 
    const max = new THREE.Vector3(globalRadius + 0.4, globalRadius + 0.4, globalRadius + 0.4); 
    const octree = new Octree(min, max); 

    for (let i = 0; i < particlesPosition.current.length; i+=3) {
        const point = new THREE.Vector3(
            particlesPosition.current[i], 
            particlesPosition.current[i+1],
            particlesPosition.current[i+2]
        )
        octree.insert(point); 
    }
    console.log(octree)

    const velocities = useRef(new Float32Array(count * 3));
    useEffect(() => {
        for (let i = 0; i < count * 3; i++) {
            velocities.current[i] = Math.random() * 2 - 1;
        }
    }, []);

    const uniforms = useMemo(() => ({
        uTime: {
            value: 0.0
        }, 
        uRadius: {
            value: globalRadius
        }, 
        uIsNeighboring: {
            value: false 
        },
    }), [])

    useFrame((state, deltaTime) => {
        const { clock } = state;

        updatePositions(deltaTime); 

        points.current.geometry.attributes.position.needsUpdate = true; 
        points.current.material.uniforms.uTime.value = clock.elapsedTime; 
    })

    const updatePositions = (deltaTime) => {
        const boundaryRepulsionStrength = 0.1; 
        const boundaryThreshold = 0.1; 
        const maxVelocity = 4; 


        for (let i = 0; i < count; i++) {
            const distanceToCenter = Math.sqrt(
                particlesPosition.current[i * 3] ** 2 + 
                particlesPosition.current[i * 3 + 1] ** 2 + 
                particlesPosition.current[i * 3 + 2] ** 2
            ); 

            const distanceToSurface = globalRadius - distanceToCenter; 
            if (distanceToSurface < boundaryThreshold) {
                const repulsionForce = boundaryRepulsionStrength * (1 - distanceToSurface / boundaryThreshold);

                const normalizedPosition = new THREE.Vector3(
                    particlesPosition.current[i * 3] / distanceToCenter,
                    particlesPosition.current[i * 3 + 1] / distanceToCenter,
                    particlesPosition.current[i * 3 + 2] / distanceToCenter
                ); 

                velocities.current[i * 3] -= normalizedPosition.x * repulsionForce * deltaTime; 
                velocities.current[i * 3 + 1] -= normalizedPosition.y * repulsionForce * deltaTime; 
                velocities.current[i * 3 + 2] -= normalizedPosition.z * repulsionForce * deltaTime; 
            }

            const separation = computeSeparation(i, particlesPosition.current, separationDistance, separationFactor); 

            velocities.current[i * 3] += separation.x * deltaTime; 
            velocities.current[i * 3 + 1] += separation.y * deltaTime; 
            velocities.current[i * 3 + 2] += separation.z * deltaTime; 

            
            const cohesion = computeCohesion(i, particlesPosition.current, cohesionDistance, cohesionFactor); 

            velocities.current[i * 3] += cohesion.x * deltaTime; 
            velocities.current[i * 3 + 1] += cohesion.y * deltaTime; 
            velocities.current[i * 3 + 2] += cohesion.z * deltaTime; 

            
            const alignment = computeAlignment(i, particlesPosition.current, velocities.current, alignmentDistance, alignmentFactor); 

            velocities.current[i * 3] += alignment.x * deltaTime; 
            velocities.current[i * 3 + 1] += alignment.y * deltaTime; 
            velocities.current[i * 3 + 2] += alignment.z * deltaTime; 
            
            
            // Calculate the magnitude of the velocity vector
            const velocityMagnitude = Math.sqrt(
                velocities.current[i * 3] ** 2 +
                velocities.current[i * 3 + 1] ** 2 +
                velocities.current[i * 3 + 2] ** 2
            );

            // Check if the magnitude exceeds the maximum velocity threshold
            if (velocityMagnitude > maxVelocity) {
                // Scale down the velocity vector to match the maximum velocity threshold
                const scale = maxVelocity / velocityMagnitude;
                velocities.current[i * 3] *= scale;
                velocities.current[i * 3 + 1] *= scale;
                velocities.current[i * 3 + 2] *= scale;
            }

            // Update particle position based on its velocity
            particlesPosition.current[i * 3] += velocities.current[i * 3] * deltaTime;
            particlesPosition.current[i * 3 + 1] += velocities.current[i * 3 + 1] * deltaTime;
            particlesPosition.current[i * 3 + 2] += velocities.current[i * 3 + 2] * deltaTime;
        }
    };

    return (
        <>
            <points ref={points}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particlesPosition.current.length / 3}
                        array={particlesPosition.current}
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
        </>
    )
}

const Flocking = () => {
    /*
    const [octree, setOctree] = useState(null);

    useEffect(() => {
        // Generate random points
        const generateRandomPoints = (count, range) => {
            const points = [];
            for (let i = 0; i < count; i++) {
                const x = Math.random() * range - range / 2;
                const y = Math.random() * range - range / 2;
                const z = Math.random() * range - range / 2;
                points.push(new THREE.Vector3(x, y, z));
            }
            return points;
        };

        // Define the parameters
        const particleCount = 500;
        const globalRadius = 1;
        const pointRange = globalRadius * 2;

        // Generate random points
        const points = generateRandomPoints(particleCount, pointRange);

        // Create an octree
        const min = new THREE.Vector3(-globalRadius, -globalRadius, -globalRadius);
        const max = new THREE.Vector3(globalRadius, globalRadius, globalRadius);
        const octreeInstance = new Octree(min, max);

        // Insert points into the octree
        points.forEach((point) => octreeInstance.insert(point));

        // Print the entire octree object to the console for inspection
        //console.log(octreeInstance);

        // Set the octree instance to the state
        setOctree(octreeInstance);
        
    }, []);
    */
    return (
        <Canvas camera={{ position: [10.0, 10.0, 10.0] }}>
            <ambientLight intensity={0.5} />
            <SphereGeometryParticles 
                count={700} 
                globalRadius={15} 
                separationDistance={2} 
                cohesionDistance={1} 
                alignmentDistance={3}
                separationFactor={5}
                cohesionFactor={2}
                alignmentFactor={5}
            />
            <OrbitControls />
        </Canvas>
    )
}

export default Flocking;

/*<OctreeBoundingBoxes octree={octree} />*/