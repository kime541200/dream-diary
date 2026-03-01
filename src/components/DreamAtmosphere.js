import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { theme } from '../styles/theme';

const BreathingSphere = ({ moodColor }) => {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.sin(t / 4);
    mesh.current.rotation.y = Math.sin(t / 2);
    const scale = 1 + Math.sin(t * 1.5) * 0.1;
    mesh.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={moodColor} 
        emissive={moodColor} 
        emissiveIntensity={0.5} 
        wireframe 
      />
    </mesh>
  );
};

export const DreamAtmosphere = ({ moodColor = theme.colors.primary }) => {
  return (
    <Canvas style={{ height: 180 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <BreathingSphere moodColor={moodColor} />
    </Canvas>
  );
};
