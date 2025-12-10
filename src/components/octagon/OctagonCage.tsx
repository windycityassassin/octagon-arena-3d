import { useMemo } from 'react';
import * as THREE from 'three';

interface OctagonCageProps {
  onAdSpaceClick: (id: string) => void;
  selectedAdSpace: string | null;
  hoveredAdSpace: string | null;
  onAdSpaceHover: (id: string | null) => void;
}

export const OctagonCage = ({
  onAdSpaceClick,
  selectedAdSpace,
  hoveredAdSpace,
  onAdSpaceHover,
}: OctagonCageProps) => {
  const sides = 8;
  const radius = 7.5;
  const height = 6;

  const posts = useMemo(() => {
    return Array.from({ length: sides }, (_, i) => {
      const angle = (i * Math.PI * 2) / sides;
      return {
        id: `post-${i + 1}`,
        position: [
          Math.cos(angle) * radius,
          height / 2,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [0, -angle, 0] as [number, number, number],
      };
    });
  }, []);

  const fencePanels = useMemo(() => {
    return Array.from({ length: sides }, (_, i) => {
      const angle1 = (i * Math.PI * 2) / sides;
      const angle2 = ((i + 1) * Math.PI * 2) / sides;
      const midAngle = (angle1 + angle2) / 2;
      
      const x1 = Math.cos(angle1) * radius;
      const z1 = Math.sin(angle1) * radius;
      const x2 = Math.cos(angle2) * radius;
      const z2 = Math.sin(angle2) * radius;
      
      const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
      
      return {
        id: `fence-${i + 1}`,
        position: [
          Math.cos(midAngle) * radius,
          height / 2,
          Math.sin(midAngle) * radius,
        ] as [number, number, number],
        rotation: [0, -midAngle + Math.PI / 2, 0] as [number, number, number],
        width,
      };
    });
  }, []);

  const isHighlighted = (id: string) => selectedAdSpace === id || hoveredAdSpace === id;

  return (
    <group>
      {/* Fence panels */}
      {fencePanels.map(({ id, position, rotation, width }) => (
        <group key={id} position={position} rotation={rotation}>
          {/* Chain link fence effect */}
          <mesh
            onClick={() => onAdSpaceClick(id)}
            onPointerEnter={() => onAdSpaceHover(id)}
            onPointerLeave={() => onAdSpaceHover(null)}
          >
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              color={isHighlighted(id) ? '#4a9eff' : '#333333'}
              transparent
              opacity={isHighlighted(id) ? 0.4 : 0.2}
              side={THREE.DoubleSide}
              wireframe
            />
          </mesh>
          
          {/* Ad space overlay on fence */}
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[width * 0.8, height * 0.5]} />
            <meshStandardMaterial
              color={isHighlighted(id) ? '#4a9eff' : '#1a1a2e'}
              transparent
              opacity={isHighlighted(id) ? 0.6 : 0.3}
              emissive={isHighlighted(id) ? '#4a9eff' : '#000000'}
              emissiveIntensity={isHighlighted(id) ? 0.2 : 0}
            />
          </mesh>

          {/* Top rail */}
          <mesh position={[0, height / 2 - 0.1, 0]}>
            <boxGeometry args={[width, 0.15, 0.1]} />
            <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Bottom rail */}
          <mesh position={[0, -height / 2 + 0.1, 0]}>
            <boxGeometry args={[width, 0.15, 0.1]} />
            <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Corner posts */}
      {posts.map(({ id, position, rotation }) => (
        <group key={id} position={position} rotation={rotation}>
          {/* Main post */}
          <mesh
            onClick={() => onAdSpaceClick(id)}
            onPointerEnter={() => onAdSpaceHover(id)}
            onPointerLeave={() => onAdSpaceHover(null)}
            castShadow
          >
            <cylinderGeometry args={[0.15, 0.15, height, 16]} />
            <meshStandardMaterial
              color={isHighlighted(id) ? '#4a9eff' : '#222222'}
              metalness={0.7}
              roughness={0.3}
              emissive={isHighlighted(id) ? '#4a9eff' : '#000000'}
              emissiveIntensity={isHighlighted(id) ? 0.3 : 0}
            />
          </mesh>

          {/* Post padding */}
          <mesh position={[0.12, 0, 0]}>
            <boxGeometry args={[0.2, height * 0.9, 0.3]} />
            <meshStandardMaterial
              color={isHighlighted(id) ? '#6ab0ff' : '#c9a227'}
              roughness={0.8}
              emissive={isHighlighted(id) ? '#4a9eff' : '#000000'}
              emissiveIntensity={isHighlighted(id) ? 0.2 : 0}
            />
          </mesh>

          {/* Post cap */}
          <mesh position={[0, height / 2 + 0.1, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
