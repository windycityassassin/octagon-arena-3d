import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LightingMode } from './types';

interface LightingProps {
  mode: LightingMode;
}

export const Lighting = ({ mode }: LightingProps) => {
  const movingLight1 = useRef<THREE.SpotLight>(null);
  const movingLight2 = useRef<THREE.SpotLight>(null);

  const color = new THREE.Color(mode.color);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Subtle light movement for dynamism
    if (movingLight1.current) {
      movingLight1.current.position.x = Math.sin(time * 0.3) * 5;
      movingLight1.current.position.z = Math.cos(time * 0.3) * 5;
    }
    if (movingLight2.current) {
      movingLight2.current.position.x = Math.cos(time * 0.25) * 6;
      movingLight2.current.position.z = Math.sin(time * 0.25) * 6;
    }
  });

  return (
    <>
      {/* Base ambient - very low for dramatic feel */}
      <ambientLight intensity={mode.ambientIntensity * 0.3} color={color} />

      {/* Main overhead spotlight - hero light */}
      <spotLight
        position={[0, 28, 0]}
        angle={0.45}
        penumbra={0.4}
        intensity={mode.spotlightIntensity * 2}
        color={color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/* Key lights - create depth and dimension */}
      <spotLight
        position={[15, 22, 15]}
        angle={0.35}
        penumbra={0.6}
        intensity={mode.spotlightIntensity * 0.8}
        color={color}
        target-position={[0, 0, 0]}
        castShadow
      />
      <spotLight
        position={[-15, 22, -15]}
        angle={0.35}
        penumbra={0.6}
        intensity={mode.spotlightIntensity * 0.8}
        color={color}
        target-position={[0, 0, 0]}
        castShadow
      />

      {/* Fill lights */}
      <spotLight
        position={[0, 18, 18]}
        angle={0.5}
        penumbra={0.7}
        intensity={mode.spotlightIntensity * 0.5}
        color={color}
        target-position={[0, 2, 0]}
      />
      <spotLight
        position={[0, 18, -18]}
        angle={0.5}
        penumbra={0.7}
        intensity={mode.spotlightIntensity * 0.5}
        color={color}
        target-position={[0, 2, 0]}
      />

      {/* Moving accent lights for subtle animation */}
      <spotLight
        ref={movingLight1}
        position={[5, 15, 5]}
        angle={0.25}
        penumbra={0.9}
        intensity={mode.spotlightIntensity * 0.2}
        color="#d4a520"
        target-position={[0, 0, 0]}
      />
      <spotLight
        ref={movingLight2}
        position={[-5, 15, -5]}
        angle={0.25}
        penumbra={0.9}
        intensity={mode.spotlightIntensity * 0.15}
        color="#d4a520"
        target-position={[0, 0, 0]}
      />

      {/* RED CORNER lighting */}
      <pointLight 
        position={[7, 5, 7]} 
        intensity={1.2} 
        color="#ff2020" 
        distance={15}
        decay={2}
      />
      <pointLight 
        position={[7, 1, 7]} 
        intensity={0.5} 
        color="#ff2020" 
        distance={10}
        decay={2}
      />
      <spotLight
        position={[10, 12, 10]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.8}
        color="#ff2020"
        target-position={[6, 0, 6]}
      />

      {/* BLUE CORNER lighting */}
      <pointLight 
        position={[-7, 5, -7]} 
        intensity={1.2} 
        color="#2040ff" 
        distance={15}
        decay={2}
      />
      <pointLight 
        position={[-7, 1, -7]} 
        intensity={0.5} 
        color="#2040ff" 
        distance={10}
        decay={2}
      />
      <spotLight
        position={[-10, 12, -10]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.8}
        color="#2040ff"
        target-position={[-6, 0, -6]}
      />

      {/* Mat edge rim lights - gold accent */}
      <pointLight position={[9, 0.5, 0]} intensity={0.25} color="#d4a520" distance={8} decay={2} />
      <pointLight position={[-9, 0.5, 0]} intensity={0.25} color="#d4a520" distance={8} decay={2} />
      <pointLight position={[0, 0.5, 9]} intensity={0.25} color="#d4a520" distance={8} decay={2} />
      <pointLight position={[0, 0.5, -9]} intensity={0.25} color="#d4a520" distance={8} decay={2} />

      {/* Hemisphere light for natural ambient fill */}
      <hemisphereLight
        color="#1a1a40"
        groundColor="#0a0a15"
        intensity={0.25}
      />

      {/* Top arena atmosphere glow */}
      <pointLight 
        position={[0, 35, 0]} 
        intensity={0.1} 
        color={color} 
        distance={80}
        decay={1}
      />
    </>
  );
};