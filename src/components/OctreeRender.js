import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

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

const OctreeBoundingBoxes = ({ octree }) => {
    const lines = useRef(); // Reference to the lines mesh

    const positions = useMemo(() => {
        const positionsArray = [];
        const corners = octree.getAllBoundingBoxCorners();
        for (let i = 0; i < corners.length; i++) {
            positionsArray.push(
                corners[i].x, corners[i].y, corners[i].z
            )
        }
        

        return new Float32Array(positionsArray);
    }, [octree]);

    const indices = useMemo(() => {
        const indicesArray = []; 

        const cubes = positions.length / 24;
        for (let i = 0; i < cubes; i++) {
            const j = 8 * i; 
            indicesArray.push(
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

        
        return new Uint32Array(indicesArray);
    })

    const uniforms = useMemo(() => ({
        uTime: {
            value: 0.0
        }, 
        
    }), [])

    useFrame(() => {
        // Update any animations or transformations if needed
    });

    return (
        <lineSegments ref={lines}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="index"
                    count={indices.length}
                    array={indices}
                    itemSize={2}
                />
            </bufferGeometry>
            <meshBasicMaterial 
            />
        </lineSegments>
    );
};

export default OctreeBoundingBoxes;