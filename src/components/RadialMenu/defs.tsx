// src/components/RadialMenu/defs.tsx
import React from 'react';
import { MENU_CONFIG } from './config';
import { radialHelpers } from './helpers';

export const RadialMenuDefs: React.FC = () => {
  const { center } = MENU_CONFIG.dimensions.viewBox;
  const rCenter = MENU_CONFIG.dimensions.rings.center;
  const macroColors = MENU_CONFIG.colors.macro;

  return (
    <defs>
      {/* Gradiente para el círculo central */}
      <radialGradient
        id="centerGradient"
        gradientUnits="userSpaceOnUse"
        cx={center}
        cy={center}
        r={rCenter}
      >
        <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
      </radialGradient>

      {/* Filtro de glow para elementos resaltados */}
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* Filtro de desenfoque para efecto de vidrio */}
      <filter id="glass" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" result="composite" />
      </filter>

      {/* Gradientes para cada macroregión */}
      {Object.entries(macroColors).map(([id, colors]) => (
        <radialGradient
          key={`gradient-macro-${id}`}
          id={radialHelpers.createGradientId('macro', id)}
          gradientUnits="userSpaceOnUse"
          cx={center}
          cy={center}
          r={MENU_CONFIG.dimensions.rings.macro.outer}
        >
          <stop offset="0%" stopColor={colors.gradientStart} stopOpacity="0.7" />
          <stop offset="100%" stopColor={colors.gradientEnd} stopOpacity="0.5" />
        </radialGradient>
      ))}
    </defs>
  );
};