import { useMemo } from 'react';
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

  return (
    <group>
      {/* Main mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <shapeGeometry args={[octagonShape]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>

      {/* Mat border/outline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[7.3, 7.5, 8]} />
        <meshStandardMaterial color="#c9a227" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Center ad space */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        onClick={() => onAdSpaceClick('mat-center')}
        onPointerEnter={() => onAdSpaceHover('mat-center')}
        onPointerLeave={() => onAdSpaceHover(null)}
      >
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial
          color={isHighlighted('mat-center') ? '#4a9eff' : '#2d2d44'}
          roughness={0.7}
          emissive={isHighlighted('mat-center') ? '#4a9eff' : '#000000'}
          emissiveIntensity={isHighlighted('mat-center') ? 0.3 : 0}
        />
      </mesh>

      {/* Center logo placeholder text */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[2.3, 2.5, 32]} />
        <meshStandardMaterial color="#c9a227" roughness={0.4} />
      </mesh>

      {/* Corner ad spaces */}
      {[
        { id: 'mat-corner-1', pos: [4, 0.01, 0] as [number, number, number] },
        { id: 'mat-corner-2', pos: [-4, 0.01, 0] as [number, number, number] },
      ].map(({ id, pos }) => (
        <mesh
          key={id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={pos}
          onClick={() => onAdSpaceClick(id)}
          onPointerEnter={() => onAdSpaceHover(id)}
          onPointerLeave={() => onAdSpaceHover(null)}
        >
          <circleGeometry args={[1.2, 32]} />
          <meshStandardMaterial
            color={isHighlighted(id) ? '#4a9eff' : '#2d2d44'}
            roughness={0.7}
            emissive={isHighlighted(id) ? '#4a9eff' : '#000000'}
            emissiveIntensity={isHighlighted(id) ? 0.3 : 0}
          />
        </mesh>
      ))}
    </group>
  );
};
