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
      <Stars radius={150} depth={80} count={2000} factor={5} saturation={0} fade speed={0.5} />
      <Environment preset="night" />
      <fog attach="fog" args={['#020208', 40, 120]} />
    </>
  );
};

// Loading screen component
const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground text-sm tracking-wider uppercase">Loading Arena...</p>
    </div>
  </div>
);

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
    <div className="relative w-full h-screen overflow-hidden scene-container">
      {/* Vignette overlay */}
      <div className="vignette z-[1]" />
      
      {/* Top gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/40 to-transparent pointer-events-none z-[1]" />
      
      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none z-[1]" />

      <Canvas 
        shadows 
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        className="!bg-transparent"
      >
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={CAMERA_PRESETS[0].position}
          fov={50}
          near={0.1}
          far={250}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={70}
          maxPolarAngle={Math.PI / 2 - 0.08}
          minPolarAngle={0.15}
          target={[0, 1.5, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
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

      {/* Instructions bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="glass-panel rounded-full px-6 py-3 text-sm text-muted-foreground flex items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="font-medium">Drag to orbit</span>
          </span>
          <span className="text-border/50">•</span>
          <span className="font-medium">Scroll to zoom</span>
          <span className="text-border/50">•</span>
          <span className="font-medium">Click ad spaces for details</span>
        </div>
      </div>

      {/* Branding */}
      <div className="absolute bottom-6 left-6 z-10">
        <h1 className="text-3xl font-black tracking-wider text-foreground text-glow">
          OCTAGON<span className="text-primary">AD</span>
        </h1>
        <p className="text-xs text-muted-foreground tracking-widest mt-1 uppercase font-medium">
          Premium Fight Advertising
        </p>
      </div>
    </div>
  );
};