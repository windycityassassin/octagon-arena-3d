import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ArenaEnvironment = () => {
  const crowdRef = useRef<THREE.Group>(null);
  const spotlightBeamsRef = useRef<THREE.Group>(null);

  // Subtle crowd wave animation
  useFrame((state) => {
    if (crowdRef.current) {
      crowdRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = child.userData.baseY + Math.sin(state.clock.elapsedTime * 1.5 + i * 0.3) * 0.15;
        }
      });
    }
    
    // Rotating spotlight beams
    if (spotlightBeamsRef.current) {
      spotlightBeamsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const crowdSections = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * Math.PI * 2) / 24;
      const radius = 30 + Math.random() * 15;
      const height = 6 + Math.random() * 8;
      return {
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [0, -angle + Math.PI, 0] as [number, number, number],
        size: [10 + Math.random() * 8, 8 + Math.random() * 6, 4] as [number, number, number],
        baseY: height,
      };
    });
  }, []);

  return (
    <group>
      {/* Dark arena floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[80, 64]} />
        <meshStandardMaterial 
          color="#050508" 
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Elevated octagon platform */}
      <mesh position={[0, -0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[9.5, 10.5, 0.5, 8]} />
        <meshStandardMaterial 
          color="#0a0a10" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Platform steps */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[11, 12, 0.3, 8]} />
        <meshStandardMaterial color="#08080c" roughness={0.85} />
      </mesh>

      {/* Platform edge lighting - gold trim */}
      <mesh position={[0, -0.01, 0]} rotation={[0, Math.PI / 8, 0]}>
        <torusGeometry args={[9.8, 0.08, 8, 8]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.5, 9.2, 8]} />
        <meshStandardMaterial
          color="#d4af37"
          transparent
          opacity={0.15}
          emissive="#d4af37"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Crowd sections with depth */}
      <group ref={crowdRef}>
        {crowdSections.map((section, i) => (
          <mesh
            key={i}
            position={section.position}
            rotation={section.rotation}
            userData={{ baseY: section.baseY }}
          >
            <boxGeometry args={section.size} />
            <meshStandardMaterial
              color="#0a0a12"
              emissive="#0a0a1a"
              emissiveIntensity={0.05 + Math.random() * 0.05}
            />
          </mesh>
        ))}
      </group>

      {/* Arena structure - upper level seating */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 16;
        const radius = 50;
        return (
          <mesh
            key={`upper-${i}`}
            position={[
              Math.cos(angle) * radius,
              18,
              Math.sin(angle) * radius,
            ]}
            rotation={[0, -angle + Math.PI, 0]}
          >
            <boxGeometry args={[18, 12, 6]} />
            <meshStandardMaterial 
              color="#060609"
              emissive="#08081a"
              emissiveIntensity={0.03}
            />
          </mesh>
        );
      })}

      {/* Arena ceiling/dome */}
      <mesh position={[0, 35, 0]}>
        <sphereGeometry args={[60, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#030305" 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Light rigging structure */}
      <group ref={spotlightBeamsRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          return (
            <group key={i}>
              {/* Truss beam */}
              <mesh
                position={[
                  Math.cos(angle) * 18,
                  20,
                  Math.sin(angle) * 18,
                ]}
                rotation={[0, -angle, 0]}
              >
                <boxGeometry args={[3, 0.8, 0.8]} />
                <meshStandardMaterial 
                  color="#15151f" 
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
              
              {/* Light fixture */}
              <mesh
                position={[
                  Math.cos(angle) * 18,
                  19,
                  Math.sin(angle) * 18,
                ]}
              >
                <cylinderGeometry args={[0.4, 0.6, 1, 8]} />
                <meshStandardMaterial 
                  color="#1a1a25" 
                  metalness={0.8}
                />
              </mesh>

              {/* Light glow effect */}
              <pointLight
                position={[
                  Math.cos(angle) * 18,
                  18,
                  Math.sin(angle) * 18,
                ]}
                intensity={0.15}
                color="#ffffff"
                distance={25}
              />
            </group>
          );
        })}
      </group>

      {/* Center overhead light array */}
      <mesh position={[0, 22, 0]}>
        <cylinderGeometry args={[4, 5, 2, 8]} />
        <meshStandardMaterial color="#15151f" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Fog/atmosphere effect - simulated with transparent planes */}
      <mesh position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#0a0a20"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corner accent lights - red and blue */}
      <pointLight position={[10, 3, 10]} intensity={0.4} color="#ff3333" distance={20} />
      <pointLight position={[-10, 3, -10]} intensity={0.4} color="#3333ff" distance={20} />
    </group>
  );
};
