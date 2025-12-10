import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OctagonMatProps {
  onAdSpaceClick: (id: string) => void;
  selectedAdSpace: string | null;
  hoveredAdSpace: string | null;
  onAdSpaceHover: (id: string | null) => void;
}

// UFC Octagon is 30 feet across (9.14m) - we'll use 7.5 units as radius for scale
const OCTAGON_RADIUS = 7.5;
const SIDES = 8;

export const OctagonMat = ({
  onAdSpaceClick,
  selectedAdSpace,
  hoveredAdSpace,
  onAdSpaceHover,
}: OctagonMatProps) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const centerLogoRef = useRef<THREE.Mesh>(null);

  const octagonShape = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < SIDES; i++) {
      const angle = (i * Math.PI * 2) / SIDES - Math.PI / 8;
      const x = Math.cos(angle) * OCTAGON_RADIUS;
      const y = Math.sin(angle) * OCTAGON_RADIUS;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const innerOctagonShape = useMemo(() => {
    const shape = new THREE.Shape();
    const innerRadius = OCTAGON_RADIUS - 0.4;
    for (let i = 0; i < SIDES; i++) {
      const angle = (i * Math.PI * 2) / SIDES - Math.PI / 8;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * innerRadius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const isHighlighted = (id: string) => selectedAdSpace === id || hoveredAdSpace === id;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (pulseRef.current) {
      const mat = pulseRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(time * 1.5) * 0.15;
    }
    
    if (centerLogoRef.current && isHighlighted('mat-center')) {
      const mat = centerLogoRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.2;
    }
  });

  return (
    <group>
      {/* Elevated Platform Base - Black steel */}
      <mesh position={[0, -0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[10, 10.5, 0.6, 8]} />
        <meshStandardMaterial 
          color="#0a0a0c"
          metalness={0.9}
          roughness={0.4}
        />
      </mesh>

      {/* Platform Top - Dark brushed steel */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[9.2, 9.2, 0.04, 8]} />
        <meshStandardMaterial 
          color="#0f0f12"
          metalness={0.85}
          roughness={0.35}
        />
      </mesh>

      {/* Main Canvas Mat - Dark gray fighting surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <shapeGeometry args={[octagonShape]} />
        <meshStandardMaterial 
          color="#1a1a1e"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Inner fighting area - slightly different shade */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]} receiveShadow>
        <shapeGeometry args={[innerOctagonShape]} />
        <meshStandardMaterial 
          color="#151518"
          roughness={0.95}
          metalness={0.01}
        />
      </mesh>

      {/* Gold border trim - signature octagon edge */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[OCTAGON_RADIUS - 0.15, OCTAGON_RADIUS, 8]} />
        <meshStandardMaterial 
          color="#d4a520"
          metalness={0.85}
          roughness={0.2}
          emissive="#d4a520"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Secondary gold accent line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <ringGeometry args={[OCTAGON_RADIUS - 0.5, OCTAGON_RADIUS - 0.4, 8]} />
        <meshStandardMaterial 
          color="#c49a1a"
          metalness={0.8}
          roughness={0.25}
          emissive="#c49a1a"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* CENTER LOGO - Premium Ad Space */}
      <group>
        {/* Outer ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
          <ringGeometry args={[2.6, 3, 64]} />
          <meshStandardMaterial 
            color="#d4a520"
            metalness={0.9}
            roughness={0.15}
            emissive="#d4a520"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Clickable center area */}
        <mesh
          ref={centerLogoRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.04, 0]}
          onClick={() => onAdSpaceClick('mat-center')}
          onPointerEnter={() => onAdSpaceHover('mat-center')}
          onPointerLeave={() => onAdSpaceHover(null)}
        >
          <circleGeometry args={[2.6, 64]} />
          <meshStandardMaterial
            color={isHighlighted('mat-center') ? '#1e3a5f' : '#0d0d10'}
            roughness={0.85}
            metalness={0.1}
            emissive={isHighlighted('mat-center') ? '#3b82f6' : '#0a0a0f'}
            emissiveIntensity={isHighlighted('mat-center') ? 0.6 : 0.02}
          />
        </mesh>

        {/* Inner accent ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.042, 0]}>
          <ringGeometry args={[1.8, 2, 64]} />
          <meshStandardMaterial 
            color="#d4a520"
            metalness={0.85}
            roughness={0.2}
            transparent
            opacity={0.7}
            emissive="#d4a520"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Center dot */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.044, 0]}>
          <circleGeometry args={[0.4, 32]} />
          <meshStandardMaterial 
            color="#d4a520"
            metalness={0.9}
            roughness={0.15}
            emissive="#d4a520"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Selection indicator ring */}
        {isHighlighted('mat-center') && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[2.9, 3.1, 64]} />
            <meshStandardMaterial 
              color="#3b82f6"
              transparent
              opacity={0.8}
              emissive="#3b82f6"
              emissiveIntensity={0.8}
            />
          </mesh>
        )}
      </group>

      {/* CORNER AD SPACES */}
      {[
        { id: 'mat-corner-1', position: [5, 0.03, 2] as [number, number, number], angle: 0 },
        { id: 'mat-corner-2', position: [-5, 0.03, -2] as [number, number, number], angle: Math.PI },
      ].map(({ id, position, angle }) => (
        <group key={id} position={position} rotation={[0, angle, 0]}>
          {/* Border ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <ringGeometry args={[1.3, 1.5, 32]} />
            <meshStandardMaterial 
              color="#d4a520"
              metalness={0.85}
              roughness={0.2}
              emissive="#d4a520"
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Clickable area */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]}
            onClick={() => onAdSpaceClick(id)}
            onPointerEnter={() => onAdSpaceHover(id)}
            onPointerLeave={() => onAdSpaceHover(null)}
          >
            <circleGeometry args={[1.3, 32]} />
            <meshStandardMaterial
              color={isHighlighted(id) ? '#1e3a5f' : '#0d0d12'}
              roughness={0.88}
              metalness={0.05}
              emissive={isHighlighted(id) ? '#3b82f6' : '#000000'}
              emissiveIntensity={isHighlighted(id) ? 0.5 : 0}
            />
          </mesh>

          {/* Inner design */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
            <ringGeometry args={[0.6, 0.8, 32]} />
            <meshStandardMaterial 
              color="#c49a1a"
              metalness={0.8}
              roughness={0.25}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Selection indicator */}
          {isHighlighted(id) && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[1.45, 1.6, 32]} />
              <meshStandardMaterial 
                color="#3b82f6"
                transparent
                opacity={0.7}
                emissive="#3b82f6"
                emissiveIntensity={0.8}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Platform edge lighting strip - subtle underglow */}
      <mesh position={[0, -0.5, 0]} rotation={[0, Math.PI / 8, 0]}>
        <torusGeometry args={[10.2, 0.05, 8, 8]} />
        <meshStandardMaterial
          color="#d4a520"
          emissive="#d4a520"
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};