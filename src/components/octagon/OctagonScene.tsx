import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { OctagonMat } from './OctagonMat';
import { OctagonCage } from './OctagonCage';
import { ArenaBanners } from './ArenaBanners';
import { ArenaEnvironment } from './ArenaEnvironment';
import { Lighting } from './Lighting';
import { ControlPanel } from './ControlPanel';
import { AdSpacePanel } from './AdSpacePanel';
import { CAMERA_PRESETS, LIGHTING_MODES } from './data';
import { CameraPreset, LightingMode } from './types';

const SceneContent = ({
  onAdSpaceClick,
  selectedAdSpace,
  hoveredAdSpace,
  onAdSpaceHover,
  lightingMode,
}: {
  onAdSpaceClick: (id: string) => void;
  selectedAdSpace: string | null;
  hoveredAdSpace: string | null;
  onAdSpaceHover: (id: string | null) => void;
  lightingMode: LightingMode;
}) => {
  return (
    <>
      <Lighting mode={lightingMode} />
      <ArenaEnvironment />
      <OctagonMat
        onAdSpaceClick={onAdSpaceClick}
        selectedAdSpace={selectedAdSpace}
        hoveredAdSpace={hoveredAdSpace}
        onAdSpaceHover={onAdSpaceHover}
      />
      <OctagonCage
        onAdSpaceClick={onAdSpaceClick}
        selectedAdSpace={selectedAdSpace}
        hoveredAdSpace={hoveredAdSpace}
        onAdSpaceHover={onAdSpaceHover}
      />
      <ArenaBanners
        onAdSpaceClick={onAdSpaceClick}
        selectedAdSpace={selectedAdSpace}
        hoveredAdSpace={hoveredAdSpace}
        onAdSpaceHover={onAdSpaceHover}
      />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="night" />
      <fog attach="fog" args={['#050510', 30, 100]} />
    </>
  );
};

export const OctagonScene = () => {
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const [selectedAdSpace, setSelectedAdSpace] = useState<string | null>(null);
  const [hoveredAdSpace, setHoveredAdSpace] = useState<string | null>(null);
  const [currentCamera, setCurrentCamera] = useState<string>('broadcast');
  const [currentLighting, setCurrentLighting] = useState<string>('event');

  const lightingMode = LIGHTING_MODES.find((m) => m.id === currentLighting) || LIGHTING_MODES[0];

  const handleCameraChange = useCallback((preset: CameraPreset) => {
    setCurrentCamera(preset.id);
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(...preset.position);
      controlsRef.current.target.set(...preset.target);
      controlsRef.current.update();
    }
  }, []);

  const handleLightingChange = useCallback((mode: LightingMode) => {
    setCurrentLighting(mode.id);
  }, []);

  const handleReset = useCallback(() => {
    const defaultPreset = CAMERA_PRESETS[0];
    handleCameraChange(defaultPreset);
    setCurrentLighting('event');
    setSelectedAdSpace(null);
    setHoveredAdSpace(null);
  }, [handleCameraChange]);

  const handleAdSpaceClick = useCallback((id: string) => {
    setSelectedAdSpace((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none z-[1]" />
      
      <Canvas 
        shadows 
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        className="!bg-[#050510]"
      >
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={CAMERA_PRESETS[0].position}
          fov={55}
          near={0.1}
          far={200}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={6}
          maxDistance={60}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.1}
          target={[0, 1, 0]}
          enableDamping={true}
          dampingFactor={0.05}
        />
        <Suspense fallback={null}>
          <SceneContent
            onAdSpaceClick={handleAdSpaceClick}
            selectedAdSpace={selectedAdSpace}
            hoveredAdSpace={hoveredAdSpace}
            onAdSpaceHover={setHoveredAdSpace}
            lightingMode={lightingMode}
          />
        </Suspense>
      </Canvas>

      <ControlPanel
        currentCamera={currentCamera}
        currentLighting={currentLighting}
        onCameraChange={handleCameraChange}
        onLightingChange={handleLightingChange}
        onReset={handleReset}
      />

      <AdSpacePanel
        selectedAdSpace={selectedAdSpace}
        hoveredAdSpace={hoveredAdSpace}
        onAdSpaceSelect={setSelectedAdSpace}
        onAdSpaceHover={setHoveredAdSpace}
      />

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="glass-panel rounded-full px-6 py-3 text-sm text-muted-foreground flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Click & drag to orbit
          </span>
          <span className="text-border">•</span>
          <span>Scroll to zoom</span>
          <span className="text-border">•</span>
          <span>Click ad spaces for details</span>
        </div>
      </div>

      {/* Branding */}
      <div className="absolute bottom-6 left-6 z-10">
        <h1 className="text-2xl font-bold tracking-widest text-foreground text-glow">
          OCTAGON<span className="text-primary">AD</span>
        </h1>
        <p className="text-xs text-muted-foreground tracking-wider mt-1">PREMIUM FIGHT ADVERTISING</p>
      </div>
    </div>
  );
};
