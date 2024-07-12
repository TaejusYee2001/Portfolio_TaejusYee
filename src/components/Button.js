import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Button = (props) => {
  const { position, onClick } = props;
  const { scene } = useThree();

  // Create a new mesh representing the button
  const geometry = new THREE.BoxGeometry(1, 1, 0.1);
  const material = new THREE.MeshBasicMaterial({ color: 'blue' });
  const mesh = new THREE.Mesh(geometry, material);

  // Set position
  mesh.position.set(position[0], position[1], position[2]);

  // Handle click event
  mesh.onClick = onClick;

  // Add mesh to the scene
  scene.add(mesh);

  // Cleanup function to remove the mesh when component unmounts
  React.useEffect(() => {
    return () => {
      scene.remove(mesh);
    };
  }, [mesh, scene]);

  // Return null because we don't want to render anything in React's DOM
  return null;
};

export default Button;
