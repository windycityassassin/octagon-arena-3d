import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AD_SPACES } from './data';

interface ArenaBannersProps {
  onAdSpaceClick: (id: string) => void;
  selectedAdSpace: string | null;
  hoveredAdSpace: string | null;
  onAdSpaceHover: (id: string | null) => void;
}

export const ArenaBanners = ({
  onAdSpaceClick,
  selectedAdSpace,
  hoveredAdSpace,
  onAdSpaceHover,
}: ArenaBannersProps) => {
  const banners = AD_SPACES.filter((space) => space.type === 'banner');
  const screenRefs = useRef<THREE.Mesh[]>([]);

  const isHighlighted = (id: string) => selectedAdSpace === id || hoveredAdSpace === id;

  // Animated LED screen effect
  useFrame((state) => {
    screenRefs.current.forEach((ref, i) => {
      if (ref) {
        const material = ref.material as THREE.MeshStandardMaterial;
        const baseIntensity = isHighlighted(banners[i]?.id) ? 0.6 : 0.25;
        material.emissiveIntensity = baseIntensity + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
      }
    });
  });

  return (
    <group>
      {banners.map((banner, index) => (
        <group
          key={banner.id}
          position={banner.position}
          rotation={banner.rotation ? banner.rotation : [0, 0, 0]}
        >
          {/* Banner support structure */}
          <mesh position={[0, 0, -0.3]}>
            <boxGeometry args={[22, 5, 0.4]} />
            <meshStandardMaterial 
              color="#0a0a10" 
              metalness={0.8} 
              roughness={0.3} 
            />
          </mesh>

          {/* LED screen frame */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[21, 4.2, 0.2]} />
            <meshStandardMaterial 
              color="#15151f" 
              metalness={0.9} 
              roughness={0.2} 
            />
          </mesh>

          {/* LED screen surface */}
          <mesh
            ref={(el) => { if (el) screenRefs.current[index] = el; }}
            position={[0, 0, 0.06]}
            onClick={() => onAdSpaceClick(banner.id)}
            onPointerEnter={() => onAdSpaceHover(banner.id)}
            onPointerLeave={() => onAdSpaceHover(null)}
          >
            <planeGeometry args={[20, 3.8]} />
            <meshStandardMaterial
              color={isHighlighted(banner.id) ? '#1a3a5c' : '#08080f'}
              emissive={isHighlighted(banner.id) ? '#2563eb' : '#101020'}
              emissiveIntensity={isHighlighted(banner.id) ? 0.6 : 0.25}
            />
          </mesh>

          {/* Screen border glow */}
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[20.4, 4.2]} />
            <meshStandardMaterial
              color="#d4af37"
              transparent
              opacity={0.15}
              emissive="#d4af37"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Placeholder content indicator */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[12, 1.5]} />
            <meshStandardMaterial
              color="#0a0a15"
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Screen edge lights */}
          <mesh position={[-10.3, 0, 0]}>
            <boxGeometry args={[0.15, 4, 0.15]} />
            <meshStandardMaterial
              color="#d4af37"
              emissive="#d4af37"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[10.3, 0, 0]}>
            <boxGeometry args={[0.15, 4, 0.15]} />
            <meshStandardMaterial
              color="#d4af37"
              emissive="#d4af37"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Support pylons */}
          <mesh position={[-9, -5, -0.5]}>
            <cylinderGeometry args={[0.15, 0.2, 8, 8]} />
            <meshStandardMaterial color="#1a1a25" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[9, -5, -0.5]}>
            <cylinderGeometry args={[0.15, 0.2, 8, 8]} />
            <meshStandardMaterial color="#1a1a25" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Jumbotron screens - smaller versions around the arena */}
      {[
        { pos: [22, 16, -22] as [number, number, number], rot: [0, Math.PI / 4, 0] as [number, number, number] },
        { pos: [-22, 16, -22] as [number, number, number], rot: [0, -Math.PI / 4, 0] as [number, number, number] },
        { pos: [22, 16, 22] as [number, number, number], rot: [0, -Math.PI / 4 + Math.PI, 0] as [number, number, number] },
        { pos: [-22, 16, 22] as [number, number, number], rot: [0, Math.PI / 4 + Math.PI, 0] as [number, number, number] },
      ].map((screen, i) => (
        <group key={i} position={screen.pos} rotation={screen.rot}>
          <mesh>
            <boxGeometry args={[10, 6, 0.5]} />
            <meshStandardMaterial color="#0a0a12" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.26]}>
            <planeGeometry args={[9.5, 5.5]} />
            <meshStandardMaterial
              color="#050510"
              emissive="#0a0a25"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
