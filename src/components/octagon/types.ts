export interface AdSpace {
  id: string;
  name: string;
  type: 'mat' | 'fence' | 'post' | 'banner';
  description: string;
  dimensions: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  price?: string;
  available: boolean;
}

export interface CameraPreset {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface LightingMode {
  id: string;
  name: string;
  ambientIntensity: number;
  spotlightIntensity: number;
  color: string;
}
