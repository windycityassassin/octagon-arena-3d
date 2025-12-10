import { Button } from '@/components/ui/button';
import { CAMERA_PRESETS, LIGHTING_MODES } from './data';
import { CameraPreset, LightingMode } from './types';
import { Camera, Lightbulb, RotateCcw } from 'lucide-react';

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
    <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 max-w-[280px]">
      {/* Camera Views */}
      <div className="glass-panel rounded-2xl p-4 hover-lift">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-primary/15 arena-glow-subtle">
            <Camera className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
            Camera Views
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CAMERA_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={currentCamera === preset.id ? 'default' : 'secondary'}
              size="sm"
              className={`text-xs h-8 px-3 font-semibold transition-all duration-200 ${
                currentCamera === preset.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                  : 'bg-secondary/60 hover:bg-secondary/90 text-secondary-foreground'
              }`}
              onClick={() => onCameraChange(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Lighting Modes */}
      <div className="glass-panel rounded-2xl p-4 hover-lift">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-primary/15 arena-glow-subtle">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
            Lighting
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LIGHTING_MODES.map((mode) => (
            <Button
              key={mode.id}
              variant={currentLighting === mode.id ? 'default' : 'secondary'}
              size="sm"
              className={`text-xs h-8 px-3 font-semibold transition-all duration-200 ${
                currentLighting === mode.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                  : 'bg-secondary/60 hover:bg-secondary/90 text-secondary-foreground'
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
        className="w-fit h-9 gap-2 font-semibold bg-secondary/60 hover:bg-secondary/90 transition-all duration-200"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4" />
        Reset View
      </Button>
    </div>
  );
};