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
  const borderRefs = useRef<THREE.Mesh[]>([]);

  const isHighlighted = (id: string) => selectedAdSpace === id || hoveredAdSpace === id;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    screenRefs.current.forEach((ref, i) => {
      if (ref) {
        const mat = ref.material as THREE.MeshStandardMaterial;
        const highlighted = isHighlighted(banners[i]?.id);
        const baseIntensity = highlighted ? 0.6 : 0.2;
        mat.emissiveIntensity = baseIntensity + Math.sin(time * 1.5 + i * 0.8) * 0.05;
      }
    });

    borderRefs.current.forEach((ref) => {
      if (ref) {
        const mat = ref.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.4 + Math.sin(time * 2) * 0.1;
      }
    });
  });

  return (
    <group>
      {banners.map((banner, index) => (
        <group
          key={banner.id}
          position={banner.position}
          rotation={banner.rotation || [0, 0, 0]}
        >
          {/* Banner housing structure */}
          <mesh position={[0, 0, -0.4]}>
            <boxGeometry args={[24, 5.5, 0.6]} />
            <meshStandardMaterial 
              color="#050508"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* LED screen frame */}
          <mesh position={[0, 0, -0.08]}>
            <boxGeometry args={[22.5, 4.5, 0.15]} />
            <meshStandardMaterial 
              color="#0a0a10"
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>

          {/* Main LED screen surface - clickable */}
          <mesh
            ref={(el) => { if (el) screenRefs.current[index] = el; }}
            position={[0, 0, 0.02]}
            onClick={() => onAdSpaceClick(banner.id)}
            onPointerEnter={() => onAdSpaceHover(banner.id)}
            onPointerLeave={() => onAdSpaceHover(null)}
          >
            <planeGeometry args={[21.5, 4]} />
            <meshStandardMaterial
              color={isHighlighted(banner.id) ? '#0f2540' : '#040408'}
              emissive={isHighlighted(banner.id) ? '#3b82f6' : '#080815'}
              emissiveIntensity={isHighlighted(banner.id) ? 0.6 : 0.2}
            />
          </mesh>

          {/* Selection highlight border */}
          {isHighlighted(banner.id) && (
            <mesh position={[0, 0, 0.03]}>
              <planeGeometry args={[22, 4.3]} />
              <meshStandardMaterial
                color="#3b82f6"
                transparent
                opacity={0.15}
                emissive="#3b82f6"
                emissiveIntensity={0.5}
              />
            </mesh>
          )}

          {/* Gold accent border - left */}
          <mesh 
            ref={(el) => { if (el && !borderRefs.current.includes(el)) borderRefs.current.push(el); }}
            position={[-11.1, 0, 0]}
          >
            <boxGeometry args={[0.12, 4.2, 0.12]} />
            <meshStandardMaterial
              color="#d4a520"
              metalness={0.9}
              roughness={0.15}
              emissive="#d4a520"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Gold accent border - right */}
          <mesh position={[11.1, 0, 0]}>
            <boxGeometry args={[0.12, 4.2, 0.12]} />
            <meshStandardMaterial
              color="#d4a520"
              metalness={0.9}
              roughness={0.15}
              emissive="#d4a520"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Top accent line */}
          <mesh position={[0, 2.15, 0]}>
            <boxGeometry args={[22, 0.08, 0.12]} />
            <meshStandardMaterial
              color="#d4a520"
              metalness={0.85}
              roughness={0.2}
              emissive="#d4a520"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Bottom accent line */}
          <mesh position={[0, -2.15, 0]}>
            <boxGeometry args={[22, 0.08, 0.12]} />
            <meshStandardMaterial
              color="#d4a520"
              metalness={0.85}
              roughness={0.2}
              emissive="#d4a520"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Support columns */}
          <mesh position={[-10, -5, -0.4]}>
            <cylinderGeometry args={[0.18, 0.22, 8, 8]} />
            <meshStandardMaterial 
              color="#0a0a10"
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[10, -5, -0.4]}>
            <cylinderGeometry args={[0.18, 0.22, 8, 8]} />
            <meshStandardMaterial 
              color="#0a0a10"
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};