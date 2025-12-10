import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ArenaEnvironment = () => {
  const crowdRef = useRef<THREE.Group>(null);

  // Subtle crowd animation
  useFrame((state) => {
    if (crowdRef.current) {
      crowdRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = 8 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.1;
        }
      });
    }
  });

  return (
    <group>
      {/* Arena floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Elevated platform for octagon */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[10, 11, 0.5, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>

      {/* Platform edge lighting */}
      <mesh position={[0, -0.01, 0]}>
        <ringGeometry args={[9.8, 10.2, 8]} />
        <meshStandardMaterial
          color="#c9a227"
          emissive="#c9a227"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Crowd sections (simplified) */}
      <group ref={crowdRef}>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 16;
          const radius = 35 + (i % 2) * 5;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                8,
                Math.sin(angle) * radius,
              ]}
              rotation={[0, -angle + Math.PI, 0]}
            >
              <boxGeometry args={[12, 10, 3]} />
              <meshStandardMaterial
                color="#1a1a1a"
                emissive="#111122"
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        })}
      </group>

      {/* Arena ceiling/rigging */}
      <mesh position={[0, 30, 0]}>
        <cylinderGeometry args={[45, 50, 5, 32]} />
        <meshStandardMaterial color="#0a0a0a" side={THREE.BackSide} />
      </mesh>

      {/* Light rigging */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 15,
              25,
              Math.sin(angle) * 15,
            ]}
          >
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial color="#222222" metalness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
};
