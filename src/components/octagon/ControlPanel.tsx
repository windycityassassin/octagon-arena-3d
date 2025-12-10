import { Button } from '@/components/ui/button';
import { CAMERA_PRESETS, LIGHTING_MODES } from './data';
import { CameraPreset, LightingMode } from './types';
import { Camera, Lightbulb, RotateCcw, Eye } from 'lucide-react';

interface ControlPanelProps {
  currentCamera: string;
  currentLighting: string;
  onCameraChange: (preset: CameraPreset) => void;
  onLightingChange: (mode: LightingMode) => void;
  onReset: () => void;
}

export const ControlPanel = ({
  currentCamera,
  currentLighting,
  onCameraChange,
  onLightingChange,
  onReset,
}: ControlPanelProps) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 max-w-xs">
      {/* Camera Presets */}
      <div className="glass-panel rounded-2xl p-4 arena-glow">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Camera className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">Camera Views</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {CAMERA_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={currentCamera === preset.id ? 'default' : 'secondary'}
              size="sm"
              className={`text-xs h-8 font-medium transition-all ${
                currentCamera === preset.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                  : 'hover:bg-secondary/80'
              }`}
              onClick={() => onCameraChange(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Lighting Modes */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">Lighting</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {LIGHTING_MODES.map((mode) => (
            <Button
              key={mode.id}
              variant={currentLighting === mode.id ? 'default' : 'secondary'}
              size="sm"
              className={`text-xs h-8 font-medium transition-all ${
                currentLighting === mode.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                  : 'hover:bg-secondary/80'
              }`}
              onClick={() => onLightingChange(mode)}
            >
              {mode.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="secondary"
        size="sm"
        className="w-fit h-9 gap-2 font-medium"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4" />
        Reset View
      </Button>
    </div>
  );
};
