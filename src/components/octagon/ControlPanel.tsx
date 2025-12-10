import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 max-w-xs">
      {/* Camera Presets */}
      <Card className="bg-background/90 backdrop-blur-sm border-border/50">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Camera Views
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="flex flex-wrap gap-1.5">
            {CAMERA_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                variant={currentCamera === preset.id ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-7"
                onClick={() => onCameraChange(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lighting Modes */}
      <Card className="bg-background/90 backdrop-blur-sm border-border/50">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Lighting
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="flex flex-wrap gap-1.5">
            {LIGHTING_MODES.map((mode) => (
              <Button
                key={mode.id}
                variant={currentLighting === mode.id ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-7"
                onClick={() => onLightingChange(mode)}
              >
                {mode.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button
        variant="secondary"
        size="sm"
        className="w-fit"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset View
      </Button>
    </div>
  );
};
