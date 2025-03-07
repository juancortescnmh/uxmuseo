import { memoryTypes, type MacroRegion } from './data/regions';

export interface LocationInfo {
  id: string;
  latitude: number;
  longitude: number;
  type: string;
  title: string;
  description: string;
}

export interface HeatPoint {
  coordinates: [number, number];
  intensity: number;
}

export interface MemoryLocation {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  type: keyof typeof memoryTypes;
  region: MacroRegion;
  department: string;
  description: string;
  code?: string; // Código para mostrar (ej: LM01)
}

export interface AppState {
  stage: 'preloader' | 'demo' | 'app' | 'tour';
  selectedMacroRegion: MacroRegion | null;
  selectedDepartment: string | null;
  selectedMemoryType: keyof typeof memoryTypes | null;
  selectedLocation: MemoryLocation | null;
}