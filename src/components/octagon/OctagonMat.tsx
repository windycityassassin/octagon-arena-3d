import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OctagonMatProps {
  onAdSpaceClick: (id: string) => void;
  selectedAdSpace: string | null;
  hoveredAdSpace: string | null;
  onAdSpaceHover: (id: string | null) => void;
}

export const OctagonMat = ({
  onAdSpaceClick,
  selectedAdSpace,
  hoveredAdSpace,
  onAdSpaceHover,
}: OctagonMatProps) => {
  const centerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const octagonShape = useMemo(() => {
    const shape = new THREE.Shape();
    const sides = 8;
    const radius = 7.5;

    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI * 2) / sides - Math.PI / 8;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();
    return shape;
  }, []);

  const isHighlighted = (id: string) => selectedAdSpace === id || hoveredAdSpace === id;

  // Animated glow effect
  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group>
      {/* Platform base with depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <cylinderGeometry args={[8.5, 9, 0.3, 8]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Main mat surface with canvas texture feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <shapeGeometry args={[octagonShape]} />
        <meshStandardMaterial 
          color="#0d0d15" 
          roughness={0.95} 
          metalness={0.05}
        />
      </mesh>

      {/* Inner mat ring - dark grey */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[6.8, 7.2, 8]} />
        <meshStandardMaterial 
          color="#1a1a25" 
          roughness={0.9}
        />
      </mesh>

      {/* Gold border outline */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[7.35, 7.5, 8]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.3} 
          metalness={0.8}
          emissive="#d4af37"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Center ad space - main logo area */}
      <mesh
        ref={centerRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={() => onAdSpaceClick('mat-center')}
        onPointerEnter={() => onAdSpaceHover('mat-center')}
        onPointerLeave={() => onAdSpaceHover(null)}
      >
        <circleGeometry args={[2.8, 64]} />
        <meshStandardMaterial
          color={isHighlighted('mat-center') ? '#1a3a5c' : '#0f0f18'}
          roughness={0.85}
          emissive={isHighlighted('mat-center') ? '#2563eb' : '#000000'}
          emissiveIntensity={isHighlighted('mat-center') ? 0.5 : 0}
        />
      </mesh>

      {/* Center octagon logo shape */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[2.0, 2.2, 8]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.4} 
          metalness={0.6}
          emissive="#d4af37"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Center inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.4} 
          metalness={0.6}
          emissive="#d4af37"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Corner ad spaces with better positioning */}
      {[
        { id: 'mat-corner-1', pos: [5.2, 0.02, 0] as [number, number, number], label: 'SPONSOR' },
        { id: 'mat-corner-2', pos: [-5.2, 0.02, 0] as [number, number, number], label: 'BRAND' },
      ].map(({ id, pos }) => (
        <group key={id}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={pos}
            onClick={() => onAdSpaceClick(id)}
            onPointerEnter={() => onAdSpaceHover(id)}
            onPointerLeave={() => onAdSpaceHover(null)}
          >
            <circleGeometry args={[1.4, 32]} />
            <meshStandardMaterial
              color={isHighlighted(id) ? '#1a3a5c' : '#12121a'}
              roughness={0.85}
              emissive={isHighlighted(id) ? '#2563eb' : '#000000'}
              emissiveIntensity={isHighlighted(id) ? 0.5 : 0}
            />
          </mesh>
          {/* Border ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], pos[1] + 0.005, pos[2]]}>
            <ringGeometry args={[1.3, 1.4, 32]} />
            <meshStandardMaterial 
              color="#d4af37" 
              roughness={0.4} 
              metalness={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Additional decorative lines on mat */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh 
            key={i} 
            rotation={[-Math.PI / 2, 0, angle]} 
            position={[0, 0.015, 0]}
          >
            <planeGeometry args={[0.05, 6]} />
            <meshStandardMaterial 
              color="#1a1a25" 
              roughness={0.9}
              transparent
              opacity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};
