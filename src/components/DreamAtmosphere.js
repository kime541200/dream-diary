import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { DeviceMotion } from 'expo-sensors';
import { theme } from '../styles/theme';

const BreathingSphere = ({ moodColor, gyroData }) => {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // 結合時間與陀螺儀數據實現視差旋轉
    mesh.current.rotation.x = Math.sin(t * rotationFactor / 4) + (gyroData.beta * 0.5 || 0);
    mesh.current.rotation.y = Math.sin(t * rotationFactor / 2) + (gyroData.gamma * 0.5 || 0);
    const scale = 1 + Math.sin(t * 1.5) * 0.1;
    mesh.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={moodColor} emissive={moodColor} emissiveIntensity={0.5} wireframe />
    </mesh>
  );
};

export const DreamAtmosphere = ({ moodColor = theme.colors.primary }) => {
  const [data, setData] = useState({ beta: 0, gamma: 0 });

  useEffect(() => {
    const subscription = DeviceMotion.addListener(({ rotation }) => {
      if (rotation) setData({ beta: rotation.beta, gamma: rotation.gamma });
    });
    DeviceMotion.setUpdateInterval(100);
    return () => subscription.remove();
  }, []);

  return (
    <Canvas style={{ height: 180 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <BreathingSphere moodColor={moodColor} gyroData={data} />
    </Canvas>
  );
};
