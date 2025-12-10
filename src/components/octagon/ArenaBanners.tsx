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

  const isHighlighted = (id: string) => selectedAdSpace === id || hoveredAdSpace === id;

  return (
    <group>
      {banners.map((banner) => (
        <group
          key={banner.id}
          position={banner.position}
          rotation={banner.rotation ? banner.rotation : [0, 0, 0]}
        >
          {/* Banner frame */}
          <mesh>
            <boxGeometry args={[20, 4, 0.3]} />
            <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.5} />
          </mesh>

          {/* LED screen surface */}
          <mesh
            position={[0, 0, 0.16]}
            onClick={() => onAdSpaceClick(banner.id)}
            onPointerEnter={() => onAdSpaceHover(banner.id)}
            onPointerLeave={() => onAdSpaceHover(null)}
          >
            <planeGeometry args={[19.5, 3.5]} />
            <meshStandardMaterial
              color={isHighlighted(banner.id) ? '#4a9eff' : '#0a0a15'}
              emissive={isHighlighted(banner.id) ? '#4a9eff' : '#1a1a2e'}
              emissiveIntensity={isHighlighted(banner.id) ? 0.5 : 0.2}
            />
          </mesh>

          {/* Screen border glow */}
          <mesh position={[0, 0, 0.14]}>
            <planeGeometry args={[19.8, 3.8]} />
            <meshStandardMaterial
              color="#c9a227"
              emissive="#c9a227"
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Arena structure hints */}
      {[
        [0, 20, -30],
        [0, 20, 30],
        [30, 20, 0],
        [-30, 20, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[25, 15, 2]} />
          <meshStandardMaterial color="#0a0a0a" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};
