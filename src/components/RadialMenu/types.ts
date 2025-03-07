// src/components/RadialMenu/types.ts
export interface RadialMenuProps {
  onSelect: (type: 'macro' | 'department' | 'memory', id: string) => void;
  isDemoMode?: boolean;
  highlightSection?: 'macro' | 'department' | 'memory' | 'center';
}