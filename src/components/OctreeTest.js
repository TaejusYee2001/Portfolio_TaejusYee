"use client"
import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Octree from "@utils/Octree";
import OctreeBoundingBoxes from "./OctreeRender";


const vertexShader = `

uniform float uDeltaTime;
uniform float uRadius;

attribute vec3 velocity; 

void main() {
    vec3 newPosition = position; // + (velocity * uDeltaTime);
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 500.0;
    gl_PointSize *= (1.0 / - viewPosition.z);
}
`;

const fragmentShader = `

void main() {
    vec3 color = vec3(0.34, 0.53, 0.96); 
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 3.0);

    color = mix(vec3(0.0), color, strength);
    gl_FragColor = vec4(color, strength);
}
`;


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


const Test = (props) => {
    const {count, radius} = props; 
    const points = useRef();

    const particlesPosition = useMemo(() => {
        return generateRandomCoordinates(count, radius * 2); 
    }, [count]); 

    const particlesVelocity = useMemo(() => {
        return generateRandomCoordinates(count, 2); 
    }, [count]); 
    
    // Create octree
    const min = new THREE.Vector3(-radius, -radius, -radius); 
    const max = new THREE.Vector3(radius, radius, radius); 
    const octree = new Octree(min, max, 5); 

    for (let i = 0; i < particlesPosition.length; i+=3) {
        const point = new THREE.Vector4(
            particlesPosition[i], 
            particlesPosition[i+1],
            particlesPosition[i+2], 
            (i / 3)
        )
        octree.insert(point); 
    }

    const firstPoint = new THREE.Vector3(particlesPosition[0], particlesPosition[1], particlesPosition[2]); 

    const neighbors = octree.searchNeighbors(firstPoint, 10);
    console.log(neighbors); 

    
    const particlesNeighbor = useMemo(() => {
        const neighborsArray = new Float32Array(count).fill(0); 
        neighbors.forEach(neighbor => {
            const index = neighbor.w; 
            neighborsArray[index] = 1.0;
        });

        return neighborsArray
    }, [count]); 

    console.log(particlesNeighbor)
    

    const uniforms = useMemo(() => ({
        uDeltaTime: {
            value: 0.0
        },
        uRadius: {
            value: radius
        }
    }), [radius]); 

    const geometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry(); 
        geometry.setAttribute(
            'position', 
            new THREE.BufferAttribute(particlesPosition, 3, false)
        ); 
        geometry.setAttribute(
            'velocity',
            new THREE.BufferAttribute(particlesVelocity, 3, false)
        );
        geometry.setAttribute(
            'neighbor',
            new THREE.BufferAttribute(particlesNeighbor, 1, false)
        );
        return geometry;
    }, [particlesPosition, particlesVelocity, particlesNeighbor]); 

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }, [uniforms]);

    const particleSystem = useMemo(() => {
        return new THREE.Points(geometry, shaderMaterial);
    }, [geometry, shaderMaterial]);
    
    
    useFrame((state, deltaTime) => {
        const { clock } = state;
        

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const x = points.current.geometry.attributes.position.array[i3]; 
            const y = points.current.geometry.attributes.position.array[i3 + 1]; 
            const z = points.current.geometry.attributes.position.array[i3 + 2];

            if (x >= radius || x <= -radius) 
                points.current.geometry.attributes.velocity.array[i3] = -particlesVelocity[i3]; 
            if (y >= radius || y <= -radius) 
                points.current.geometry.attributes.velocity.array[i3 + 1] = -particlesVelocity[i3 + 1]; 
            if (z >= radius || z <= -radius) 
                points.current.geometry.attributes.velocity.array[i3 + 2] = -particlesVelocity[i3 + 2]; 
            
            
            points.current.geometry.attributes.position.array[i3] += particlesVelocity[i3] * deltaTime;
            points.current.geometry.attributes.position.array[i3 + 1] += particlesVelocity[i3 + 1] * deltaTime;
            points.current.geometry.attributes.position.array[i3 + 2] += particlesVelocity[i3 + 2] * deltaTime;
                
        }
        
        points.current.geometry.attributes.position.needsUpdate = true;
        points.current.geometry.attributes.velocity.needsUpdate = true; 
        points.current.material.uniforms.uDeltaTime.value = deltaTime; 
    }); 
    
    
    return (
        <>
            <points ref={points}>
                <bufferGeometry attach="geometry" {...geometry} />
                <shaderMaterial attach="material" {...shaderMaterial} />
            </points>
            <OctreeBoundingBoxes octree={octree} />
        </>
    ); 
    
}; 

const OctreeTest = () => {
    
    return (
        <Canvas camera={{ position: [10.0, 10.0, 10.0] }}>
            <ambientLight intensity={0.5} />
            <Test count={400} radius={10}/>
            <OrbitControls />
        </Canvas>
    )
}

export default OctreeTest;


