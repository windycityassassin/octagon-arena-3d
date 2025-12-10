import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
  const height = 5.5;
  const postPaddingRefs = useRef<THREE.Mesh[]>([]);

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
        angle,
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

  // Subtle animation for highlighted posts
  useFrame((state) => {
    postPaddingRefs.current.forEach((ref, i) => {
      if (ref && isHighlighted(`post-${i + 1}`)) {
        const material = ref.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    });
  });

  // Create wire mesh pattern
  const createWireMesh = (width: number, height: number) => {
    const wires: JSX.Element[] = [];
    const spacing = 0.15;
    
    // Vertical wires
    for (let x = -width / 2; x <= width / 2; x += spacing) {
      wires.push(
        <mesh key={`v-${x}`} position={[x, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, height, 6]} />
          <meshStandardMaterial color="#2a2a35" metalness={0.9} roughness={0.3} />
        </mesh>
      );
    }
    
    // Horizontal wires
    for (let y = -height / 2; y <= height / 2; y += spacing) {
      wires.push(
        <mesh key={`h-${y}`} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, width, 6]} />
          <meshStandardMaterial color="#2a2a35" metalness={0.9} roughness={0.3} />
        </mesh>
      );
    }
    
    return wires;
  };

  return (
    <group>
      {/* Fence panels with realistic chain-link */}
      {fencePanels.map(({ id, position, rotation, width }) => (
        <group key={id} position={position} rotation={rotation}>
          {/* Fence frame - top rail */}
          <mesh position={[0, height / 2 - 0.08, 0]}>
            <boxGeometry args={[width + 0.1, 0.12, 0.08]} />
            <meshStandardMaterial color="#1a1a22" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Fence frame - bottom rail */}
          <mesh position={[0, -height / 2 + 0.08, 0]}>
            <boxGeometry args={[width + 0.1, 0.12, 0.08]} />
            <meshStandardMaterial color="#1a1a22" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Wire mesh background */}
          <group position={[0, 0, 0]}>
            {createWireMesh(width - 0.2, height - 0.3)}
          </group>

          {/* Clickable ad overlay area */}
          <mesh
            position={[0, 0.3, 0.08]}
            onClick={() => onAdSpaceClick(id)}
            onPointerEnter={() => onAdSpaceHover(id)}
            onPointerLeave={() => onAdSpaceHover(null)}
          >
            <planeGeometry args={[width * 0.75, height * 0.4]} />
            <meshStandardMaterial
              color={isHighlighted(id) ? '#1a3a5c' : '#0a0a12'}
              transparent
              opacity={isHighlighted(id) ? 0.85 : 0.6}
              emissive={isHighlighted(id) ? '#2563eb' : '#000000'}
              emissiveIntensity={isHighlighted(id) ? 0.4 : 0}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Ad space border when highlighted */}
          {isHighlighted(id) && (
            <mesh position={[0, 0.3, 0.09]}>
              <planeGeometry args={[width * 0.75 + 0.1, height * 0.4 + 0.1]} />
              <meshStandardMaterial
                color="#d4af37"
                transparent
                opacity={0.3}
                emissive="#d4af37"
                emissiveIntensity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* "AD SPACE" placeholder text indicator */}
          <mesh position={[0, 0.3, 0.1]}>
            <planeGeometry args={[width * 0.5, 0.6]} />
            <meshStandardMaterial
              color="#15151f"
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Corner posts with padding */}
      {posts.map(({ id, position, rotation, angle }, index) => {
        const isRed = index === 0 || index === 1 || index === 7;
        const isBlue = index === 3 || index === 4 || index === 5;
        const paddingColor = isRed ? '#c41e3a' : isBlue ? '#1e40af' : '#d4af37';
        
        return (
          <group key={id} position={position} rotation={rotation}>
            {/* Main structural post */}
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.12, height + 0.5, 16]} />
              <meshStandardMaterial
                color="#1a1a22"
                metalness={0.85}
                roughness={0.15}
              />
            </mesh>

            {/* Post padding - the colored part */}
            <mesh
              ref={(el) => { if (el) postPaddingRefs.current[index] = el; }}
              position={[0.15, 0, 0]}
              onClick={() => onAdSpaceClick(id)}
              onPointerEnter={() => onAdSpaceHover(id)}
              onPointerLeave={() => onAdSpaceHover(null)}
              castShadow
            >
              <boxGeometry args={[0.25, height * 0.85, 0.35]} />
              <meshStandardMaterial
                color={isHighlighted(id) ? '#3b82f6' : paddingColor}
                roughness={0.7}
                metalness={0.1}
                emissive={isHighlighted(id) ? '#2563eb' : paddingColor}
                emissiveIntensity={isHighlighted(id) ? 0.4 : 0.1}
              />
            </mesh>

            {/* Post cap - top */}
            <mesh position={[0, height / 2 + 0.25, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial 
                color="#1a1a22" 
                metalness={0.9} 
                roughness={0.1}
              />
            </mesh>

            {/* Corner indicator rings */}
            {(isRed || isBlue) && (
              <>
                <mesh position={[0, height / 2 - 0.3, 0]}>
                  <torusGeometry args={[0.2, 0.03, 8, 24]} />
                  <meshStandardMaterial 
                    color={paddingColor} 
                    metalness={0.5}
                    emissive={paddingColor}
                    emissiveIntensity={0.3}
                  />
                </mesh>
                <mesh position={[0, -height / 2 + 0.3, 0]}>
                  <torusGeometry args={[0.2, 0.03, 8, 24]} />
                  <meshStandardMaterial 
                    color={paddingColor} 
                    metalness={0.5}
                    emissive={paddingColor}
                    emissiveIntensity={0.3}
                  />
                </mesh>
              </>
            )}
          </group>
        );
      })}

      {/* Top octagon frame ring */}
      <mesh position={[0, height, 0]} rotation={[0, Math.PI / 8, 0]}>
        <torusGeometry args={[radius, 0.06, 8, 8]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
};
