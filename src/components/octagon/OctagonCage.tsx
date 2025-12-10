import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OctagonCageProps {
  onAdSpaceClick: (id: string) => void;
  selectedAdSpace: string | null;
  hoveredAdSpace: string | null;
  onAdSpaceHover: (id: string | null) => void;
}

const SIDES = 8;
const RADIUS = 7.5;
const CAGE_HEIGHT = 6;
const POST_RADIUS = 0.15;

export const OctagonCage = ({
  onAdSpaceClick,
  selectedAdSpace,
  hoveredAdSpace,
  onAdSpaceHover,
}: OctagonCageProps) => {
  const highlightRefs = useRef<THREE.Mesh[]>([]);

  const posts = useMemo(() => {
    return Array.from({ length: SIDES }, (_, i) => {
      const angle = (i * Math.PI * 2) / SIDES;
      return {
        id: `post-${i + 1}`,
        position: [
          Math.cos(angle) * RADIUS,
          CAGE_HEIGHT / 2,
          Math.sin(angle) * RADIUS,
        ] as [number, number, number],
        angle,
        // Red corner (posts 1, 2, 8), Blue corner (posts 4, 5, 6)
        isRed: i === 0 || i === 1 || i === 7,
        isBlue: i === 3 || i === 4 || i === 5,
      };
    });
  }, []);

  const fencePanels = useMemo(() => {
    return Array.from({ length: SIDES }, (_, i) => {
      const angle1 = (i * Math.PI * 2) / SIDES;
      const angle2 = ((i + 1) * Math.PI * 2) / SIDES;
      const midAngle = (angle1 + angle2) / 2;

      const x1 = Math.cos(angle1) * RADIUS;
      const z1 = Math.sin(angle1) * RADIUS;
      const x2 = Math.cos(angle2) * RADIUS;
      const z2 = Math.sin(angle2) * RADIUS;
      const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));

      return {
        id: `fence-${i + 1}`,
        position: [
          Math.cos(midAngle) * RADIUS,
          CAGE_HEIGHT / 2,
          Math.sin(midAngle) * RADIUS,
        ] as [number, number, number],
        rotation: [0, -midAngle + Math.PI / 2, 0] as [number, number, number],
        width,
      };
    });
  }, []);

  const isHighlighted = (id: string) => selectedAdSpace === id || hoveredAdSpace === id;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    highlightRefs.current.forEach((ref, i) => {
      if (ref) {
        const mat = ref.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.4 + Math.sin(time * 3 + i * 0.5) * 0.2;
      }
    });
  });

  // Create detailed chain-link mesh
  const ChainLinkMesh = ({ width, height }: { width: number; height: number }) => {
    const wires: JSX.Element[] = [];
    const vSpacing = 0.12;
    const hSpacing = 0.12;
    
    // Vertical wires
    const vCount = Math.floor(width / vSpacing);
    for (let i = 0; i <= vCount; i++) {
      const x = -width / 2 + i * vSpacing;
      wires.push(
        <mesh key={`v-${i}`} position={[x, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, height, 4]} />
          <meshStandardMaterial 
            color="#1f1f25"
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>
      );
    }
    
    // Horizontal wires
    const hCount = Math.floor(height / hSpacing);
    for (let i = 0; i <= hCount; i++) {
      const y = -height / 2 + i * hSpacing;
      wires.push(
        <mesh key={`h-${i}`} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.006, 0.006, width, 4]} />
          <meshStandardMaterial 
            color="#1f1f25"
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>
      );
    }
    
    return <group>{wires}</group>;
  };

  return (
    <group>
      {/* FENCE PANELS */}
      {fencePanels.map(({ id, position, rotation, width }, index) => (
        <group key={id} position={position} rotation={rotation}>
          {/* Main fence frame - top rail */}
          <mesh position={[0, CAGE_HEIGHT / 2 - 0.1, 0]} castShadow>
            <boxGeometry args={[width + 0.2, 0.15, 0.1]} />
            <meshStandardMaterial 
              color="#0c0c0e"
              metalness={0.92}
              roughness={0.15}
            />
          </mesh>

          {/* Main fence frame - bottom rail */}
          <mesh position={[0, -CAGE_HEIGHT / 2 + 0.1, 0]} castShadow>
            <boxGeometry args={[width + 0.2, 0.15, 0.1]} />
            <meshStandardMaterial 
              color="#0c0c0e"
              metalness={0.92}
              roughness={0.15}
            />
          </mesh>

          {/* Chain-link fence */}
          <group position={[0, 0, 0]}>
            <ChainLinkMesh width={width - 0.1} height={CAGE_HEIGHT - 0.4} />
          </group>

          {/* Invisible clickable area for fence ad space */}
          <mesh
            position={[0, 0, 0.03]}
            onClick={() => onAdSpaceClick(id)}
            onPointerEnter={() => onAdSpaceHover(id)}
            onPointerLeave={() => onAdSpaceHover(null)}
            visible={false}
          >
            <planeGeometry args={[width * 0.9, CAGE_HEIGHT * 0.8]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Highlight glow when selected - subtle outline effect */}
          {isHighlighted(id) && (
            <mesh
              ref={(el) => { if (el) highlightRefs.current[index] = el; }}
              position={[0, 0, 0.04]}
            >
              <planeGeometry args={[width * 0.92, CAGE_HEIGHT * 0.85]} />
              <meshStandardMaterial
                color="#3b82f6"
                transparent
                opacity={0.15}
                emissive="#3b82f6"
                emissiveIntensity={0.6}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* CORNER POSTS with padding */}
      {posts.map(({ id, position, angle, isRed, isBlue }, index) => {
        const paddingColor = isRed ? '#c41e3a' : isBlue ? '#1e40af' : '#1a1a20';
        const glowColor = isRed ? '#ff2222' : isBlue ? '#2255ff' : '#d4a520';
        
        return (
          <group key={id} position={position} rotation={[0, -angle, 0]}>
            {/* Main structural post - black steel */}
            <mesh castShadow>
              <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, CAGE_HEIGHT + 0.3, 16]} />
              <meshStandardMaterial
                color="#0a0a0c"
                metalness={0.95}
                roughness={0.12}
              />
            </mesh>

            {/* Post cap - spherical top */}
            <mesh position={[0, CAGE_HEIGHT / 2 + 0.2, 0]} castShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial 
                color="#0a0a0c"
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>

            {/* Padded section - the colored advertising area */}
            <mesh
              position={[0.18, 0, 0]}
              onClick={() => onAdSpaceClick(id)}
              onPointerEnter={() => onAdSpaceHover(id)}
              onPointerLeave={() => onAdSpaceHover(null)}
              castShadow
            >
              <boxGeometry args={[0.28, CAGE_HEIGHT * 0.75, 0.4]} />
              <meshStandardMaterial
                color={isHighlighted(id) ? '#2563eb' : paddingColor}
                roughness={0.75}
                metalness={0.08}
                emissive={isHighlighted(id) ? '#2563eb' : glowColor}
                emissiveIntensity={isHighlighted(id) ? 0.5 : 0.12}
              />
            </mesh>

            {/* Padding edge trim */}
            <mesh position={[0.32, 0, 0]}>
              <boxGeometry args={[0.02, CAGE_HEIGHT * 0.76, 0.42]} />
              <meshStandardMaterial
                color={paddingColor}
                metalness={0.6}
                roughness={0.3}
                emissive={glowColor}
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Corner indicator rings */}
            {(isRed || isBlue) && (
              <>
                <mesh position={[0, CAGE_HEIGHT / 2 - 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.22, 0.025, 8, 24]} />
                  <meshStandardMaterial 
                    color={glowColor}
                    metalness={0.7}
                    roughness={0.2}
                    emissive={glowColor}
                    emissiveIntensity={0.4}
                  />
                </mesh>
                <mesh position={[0, -CAGE_HEIGHT / 2 + 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.22, 0.025, 8, 24]} />
                  <meshStandardMaterial 
                    color={glowColor}
                    metalness={0.7}
                    roughness={0.2}
                    emissive={glowColor}
                    emissiveIntensity={0.4}
                  />
                </mesh>
              </>
            )}

            {/* Selection glow ring */}
            {isHighlighted(id) && (
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.35, 0.02, 8, 32]} />
                <meshStandardMaterial 
                  color="#3b82f6"
                  transparent
                  opacity={0.8}
                  emissive="#3b82f6"
                  emissiveIntensity={1}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* TOP OCTAGON FRAME - connects all posts */}
      <mesh position={[0, CAGE_HEIGHT, 0]} rotation={[0, Math.PI / 8, 0]}>
        <torusGeometry args={[RADIUS, 0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#0c0c0e"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Gold accent ring on top */}
      <mesh position={[0, CAGE_HEIGHT + 0.05, 0]} rotation={[0, Math.PI / 8, 0]}>
        <torusGeometry args={[RADIUS, 0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#d4a520"
          metalness={0.9}
          roughness={0.15}
          emissive="#d4a520"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};