import { useRef } from 'react';
import * as THREE from 'three';
import { LightingMode } from './types';

interface LightingProps {
  mode: LightingMode;
}

export const Lighting = ({ mode }: LightingProps) => {
  const spotLightRef1 = useRef<THREE.SpotLight>(null);
  const spotLightRef2 = useRef<THREE.SpotLight>(null);

  const color = new THREE.Color(mode.color);

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={mode.ambientIntensity} color={color} />

      {/* Main overhead spotlights */}
      <spotLight
        ref={spotLightRef1}
        position={[0, 20, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={mode.spotlightIntensity}
        color={color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Secondary spotlights for drama */}
      <spotLight
        ref={spotLightRef2}
        position={[15, 15, 15]}
        angle={0.4}
        penumbra={0.7}
        intensity={mode.spotlightIntensity * 0.5}
        color={color}
        target-position={[0, 0, 0]}
      />

      <spotLight
        position={[-15, 15, -15]}
        angle={0.4}
        penumbra={0.7}
        intensity={mode.spotlightIntensity * 0.5}
        color={color}
        target-position={[0, 0, 0]}
      />

      {/* Rim lights for the cage */}
      <pointLight position={[10, 3, 0]} intensity={0.3} color="#4a9eff" distance={15} />
      <pointLight position={[-10, 3, 0]} intensity={0.3} color="#ff4a4a" distance={15} />

      {/* Arena ambient glow */}
      <pointLight position={[0, 25, 0]} intensity={0.2} color={color} distance={50} />
    </>
  );
};
