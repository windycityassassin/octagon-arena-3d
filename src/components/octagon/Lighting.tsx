import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LightingMode } from './types';

interface LightingProps {
  mode: LightingMode;
}

export const Lighting = ({ mode }: LightingProps) => {
  const spotLightRef1 = useRef<THREE.SpotLight>(null);
  const spotLightRef2 = useRef<THREE.SpotLight>(null);
  const movingLightRef = useRef<THREE.SpotLight>(null);

  const color = new THREE.Color(mode.color);

  // Subtle light animation for dramatic effect
  useFrame((state) => {
    if (movingLightRef.current) {
      const time = state.clock.elapsedTime;
      movingLightRef.current.position.x = Math.sin(time * 0.5) * 8;
      movingLightRef.current.position.z = Math.cos(time * 0.5) * 8;
    }
  });

  return (
    <>
      {/* Deep ambient for atmosphere */}
      <ambientLight intensity={mode.ambientIntensity * 0.5} color={color} />

      {/* Main overhead spotlight - the hero light */}
      <spotLight
        ref={spotLightRef1}
        position={[0, 22, 0]}
        angle={0.5}
        penumbra={0.3}
        intensity={mode.spotlightIntensity * 1.5}
        color={color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Secondary key lights - create depth */}
      <spotLight
        ref={spotLightRef2}
        position={[12, 18, 12]}
        angle={0.4}
        penumbra={0.5}
        intensity={mode.spotlightIntensity * 0.7}
        color={color}
        target-position={[0, 0, 0]}
        castShadow
      />

      <spotLight
        position={[-12, 18, -12]}
        angle={0.4}
        penumbra={0.5}
        intensity={mode.spotlightIntensity * 0.7}
        color={color}
        target-position={[0, 0, 0]}
        castShadow
      />

      {/* Fill lights for the cage */}
      <spotLight
        position={[0, 15, 15]}
        angle={0.6}
        penumbra={0.8}
        intensity={mode.spotlightIntensity * 0.4}
        color={color}
        target-position={[0, 2, 0]}
      />

      <spotLight
        position={[0, 15, -15]}
        angle={0.6}
        penumbra={0.8}
        intensity={mode.spotlightIntensity * 0.4}
        color={color}
        target-position={[0, 2, 0]}
      />

      {/* Moving accent light for dynamism */}
      <spotLight
        ref={movingLightRef}
        position={[8, 12, 0]}
        angle={0.3}
        penumbra={0.9}
        intensity={mode.spotlightIntensity * 0.2}
        color="#d4af37"
        target-position={[0, 0, 0]}
      />

      {/* Corner accent lights - red corner */}
      <pointLight 
        position={[7, 4, 7]} 
        intensity={0.6} 
        color="#ff2222" 
        distance={12}
      />
      <pointLight 
        position={[7, 1, 7]} 
        intensity={0.3} 
        color="#ff2222" 
        distance={8}
      />

      {/* Corner accent lights - blue corner */}
      <pointLight 
        position={[-7, 4, -7]} 
        intensity={0.6} 
        color="#2244ff" 
        distance={12}
      />
      <pointLight 
        position={[-7, 1, -7]} 
        intensity={0.3} 
        color="#2244ff" 
        distance={8}
      />

      {/* Mat edge rim lights */}
      <pointLight position={[8, 0.5, 0]} intensity={0.15} color="#d4af37" distance={6} />
      <pointLight position={[-8, 0.5, 0]} intensity={0.15} color="#d4af37" distance={6} />
      <pointLight position={[0, 0.5, 8]} intensity={0.15} color="#d4af37" distance={6} />
      <pointLight position={[0, 0.5, -8]} intensity={0.15} color="#d4af37" distance={6} />

      {/* Hemisphere light for natural fill */}
      <hemisphereLight
        color="#1a1a30"
        groundColor="#0a0a15"
        intensity={0.3}
      />

      {/* Top arena glow */}
      <pointLight position={[0, 30, 0]} intensity={0.15} color={color} distance={60} />
    </>
  );
};
