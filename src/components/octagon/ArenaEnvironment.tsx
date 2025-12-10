import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ArenaEnvironment = () => {
  const crowdRef = useRef<THREE.Group>(null);
  const spotlightsRef = useRef<THREE.Group>(null);

  // Subtle crowd animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (crowdRef.current) {
      crowdRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child.userData.baseY !== undefined) {
          child.position.y = child.userData.baseY + Math.sin(time * 0.8 + i * 0.4) * 0.08;
        }
      });
    }
    
    if (spotlightsRef.current) {
      spotlightsRef.current.rotation.y = time * 0.03;
    }
  });

  // Generate crowd sections
  const crowdSections = useMemo(() => {
    const sections: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      size: [number, number, number];
      baseY: number;
    }> = [];
    
    // Lower tier - closer to action
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      const radius = 20 + Math.random() * 5;
      const height = 3 + Math.random() * 2;
      sections.push({
        position: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rotation: [0, -angle + Math.PI, 0.1],
        size: [8 + Math.random() * 4, 5 + Math.random() * 3, 3],
        baseY: height,
      });
    }
    
    // Upper tier - larger sections
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + Math.PI / 12;
      const radius = 35 + Math.random() * 8;
      const height = 12 + Math.random() * 4;
      sections.push({
        position: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rotation: [0, -angle + Math.PI, 0.15],
        size: [12 + Math.random() * 6, 8 + Math.random() * 4, 4],
        baseY: height,
      });
    }
    
    return sections;
  }, []);

  return (
    <group>
      {/* Arena floor - dark concrete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
        <circleGeometry args={[100, 64]} />
        <meshStandardMaterial 
          color="#04040a"
          roughness={0.98}
          metalness={0.02}
        />
      </mesh>

      {/* Walkway ring around octagon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <ringGeometry args={[11, 16, 32]} />
        <meshStandardMaterial 
          color="#080810"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Walkway accent lighting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <ringGeometry args={[10.8, 11, 32]} />
        <meshStandardMaterial 
          color="#d4a520"
          emissive="#d4a520"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Crowd sections with subtle variation */}
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
              color={i % 2 === 0 ? '#050508' : '#06060a'}
              roughness={0.95}
              emissive="#08081a"
              emissiveIntensity={0.02 + Math.random() * 0.03}
            />
          </mesh>
        ))}
      </group>

      {/* Arena structure - ceiling/dome */}
      <mesh position={[0, 45, 0]}>
        <sphereGeometry args={[80, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#020204"
          side={THREE.BackSide}
          metalness={0.3}
          roughness={0.9}
        />
      </mesh>

      {/* Lighting rig structure */}
      <group ref={spotlightsRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const radius = 22;
          return (
            <group key={i}>
              {/* Truss beam */}
              <mesh
                position={[Math.cos(angle) * radius, 25, Math.sin(angle) * radius]}
                rotation={[0, -angle, Math.PI / 8]}
              >
                <boxGeometry args={[4, 0.5, 0.5]} />
                <meshStandardMaterial 
                  color="#0a0a10"
                  metalness={0.95}
                  roughness={0.15}
                />
              </mesh>
              
              {/* Light fixture housing */}
              <mesh
                position={[Math.cos(angle) * radius, 23.5, Math.sin(angle) * radius]}
              >
                <cylinderGeometry args={[0.5, 0.7, 1.2, 8]} />
                <meshStandardMaterial 
                  color="#0c0c12"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>

              {/* Light lens glow */}
              <mesh
                position={[Math.cos(angle) * radius, 22.8, Math.sin(angle) * radius]}
              >
                <circleGeometry args={[0.4, 16]} />
                <meshStandardMaterial 
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Central overhead light array */}
      <mesh position={[0, 28, 0]}>
        <cylinderGeometry args={[5, 6, 2.5, 8]} />
        <meshStandardMaterial 
          color="#0a0a10"
          metalness={0.92}
          roughness={0.15}
        />
      </mesh>

      {/* Jumbotron screens at corners */}
      {[
        { pos: [28, 18, 28] as [number, number, number], rot: [0, -Math.PI / 4, 0] as [number, number, number] },
        { pos: [-28, 18, 28] as [number, number, number], rot: [0, Math.PI / 4, 0] as [number, number, number] },
        { pos: [28, 18, -28] as [number, number, number], rot: [0, Math.PI / 4 + Math.PI, 0] as [number, number, number] },
        { pos: [-28, 18, -28] as [number, number, number], rot: [0, -Math.PI / 4 + Math.PI, 0] as [number, number, number] },
      ].map((screen, i) => (
        <group key={i} position={screen.pos} rotation={screen.rot}>
          {/* Screen housing */}
          <mesh>
            <boxGeometry args={[14, 9, 0.8]} />
            <meshStandardMaterial 
              color="#050508"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
          {/* Screen surface */}
          <mesh position={[0, 0, 0.42]}>
            <planeGeometry args={[13, 8]} />
            <meshStandardMaterial
              color="#030308"
              emissive="#0a0a20"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Screen frame accent */}
          <mesh position={[0, 0, 0.41]}>
            <planeGeometry args={[13.5, 8.5]} />
            <meshStandardMaterial
              color="#1a1a25"
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};