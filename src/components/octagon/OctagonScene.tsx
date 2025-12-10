import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
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
      <Environment preset="night" />
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
    <div className="relative w-full h-screen bg-background">
      <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={CAMERA_PRESETS[0].position}
          fov={60}
          near={0.1}
          far={200}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={80}
          maxPolarAngle={Math.PI / 2 - 0.1}
          target={[0, 0, 0]}
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-muted-foreground">
          Click and drag to orbit • Scroll to zoom • Click ad spaces to view details
        </div>
      </div>
    </div>
  );
};
