import { AdSpace, CameraPreset, LightingMode } from './types';

export const AD_SPACES: AdSpace[] = [
  {
    id: 'mat-center',
    name: 'Mat Center Logo',
    type: 'mat',
    description: 'Prime center mat position - highest visibility during fights',
    dimensions: '8ft x 8ft',
    position: [0, 0.01, 0],
    available: true,
  },
  {
    id: 'mat-corner-1',
    name: 'Mat Corner 1',
    type: 'mat',
    description: 'Corner mat branding near red corner',
    dimensions: '4ft x 4ft',
    position: [4, 0.01, 0],
    available: true,
  },
  {
    id: 'mat-corner-2',
    name: 'Mat Corner 2',
    type: 'mat',
    description: 'Corner mat branding near blue corner',
    dimensions: '4ft x 4ft',
    position: [-4, 0.01, 0],
    available: true,
  },
  // Fence panels (8 sides of octagon)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `fence-${i + 1}`,
    name: `Fence Panel ${i + 1}`,
    type: 'fence' as const,
    description: `Fence panel ${i + 1} - visible from broadcast angles`,
    dimensions: '6ft x 6ft',
    position: [
      Math.cos((i * Math.PI * 2) / 8 + Math.PI / 8) * 7,
      3,
      Math.sin((i * Math.PI * 2) / 8 + Math.PI / 8) * 7,
    ] as [number, number, number],
    rotation: [0, -(i * Math.PI * 2) / 8 - Math.PI / 8, 0] as [number, number, number],
    available: true,
  })),
  // Corner posts (8 posts)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `post-${i + 1}`,
    name: `Corner Post ${i + 1}`,
    type: 'post' as const,
    description: `Padded corner post ${i + 1} - premium branding spot`,
    dimensions: '1ft x 6ft',
    position: [
      Math.cos((i * Math.PI * 2) / 8) * 7.5,
      3,
      Math.sin((i * Math.PI * 2) / 8) * 7.5,
    ] as [number, number, number],
    available: true,
  })),
  // Arena banners
  {
    id: 'banner-north',
    name: 'Arena Banner North',
    type: 'banner',
    description: 'Large LED banner facing broadcast cameras',
    dimensions: '40ft x 8ft',
    position: [0, 12, -25],
    available: true,
  },
  {
    id: 'banner-south',
    name: 'Arena Banner South',
    type: 'banner',
    description: 'Large LED banner opposite broadcast cameras',
    dimensions: '40ft x 8ft',
    position: [0, 12, 25],
    available: true,
  },
  {
    id: 'banner-east',
    name: 'Arena Banner East',
    type: 'banner',
    description: 'Side arena banner - high visibility',
    dimensions: '30ft x 6ft',
    position: [25, 10, 0],
    rotation: [0, -Math.PI / 2, 0],
    available: true,
  },
  {
    id: 'banner-west',
    name: 'Arena Banner West',
    type: 'banner',
    description: 'Side arena banner - high visibility',
    dimensions: '30ft x 6ft',
    position: [-25, 10, 0],
    rotation: [0, Math.PI / 2, 0],
    available: true,
  },
];

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'broadcast',
    name: 'Broadcast View',
    position: [0, 8, 18],
    target: [0, 0, 0],
  },
  {
    id: 'overhead',
    name: 'Overhead',
    position: [0, 25, 0],
    target: [0, 0, 0],
  },
  {
    id: 'corner-red',
    name: 'Red Corner',
    position: [12, 4, 12],
    target: [0, 0, 0],
  },
  {
    id: 'corner-blue',
    name: 'Blue Corner',
    position: [-12, 4, -12],
    target: [0, 0, 0],
  },
  {
    id: 'mat-close',
    name: 'Mat Close-up',
    position: [0, 6, 8],
    target: [0, 0, 0],
  },
  {
    id: 'wide',
    name: 'Wide Arena',
    position: [0, 15, 35],
    target: [0, 0, 0],
  },
];

export const LIGHTING_MODES: LightingMode[] = [
  {
    id: 'event',
    name: 'Event Mode',
    ambientIntensity: 0.3,
    spotlightIntensity: 2,
    color: '#ffffff',
  },
  {
    id: 'spotlight',
    name: 'Spotlight Focus',
    ambientIntensity: 0.1,
    spotlightIntensity: 3,
    color: '#fff5e6',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    ambientIntensity: 0.05,
    spotlightIntensity: 2.5,
    color: '#ff6b6b',
  },
  {
    id: 'promo',
    name: 'Promo Shoot',
    ambientIntensity: 0.5,
    spotlightIntensity: 1.5,
    color: '#e6f0ff',
  },
];
