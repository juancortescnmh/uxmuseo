// src/components/demo/DemoControls.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, RotateCcw } from 'lucide-react';

interface DemoControlsProps {
  currentStep: number;
  totalSteps: number;
  onComplete: () => void;
  onStartTour: () => void;
  onReset: () => void;
  showResetButton: boolean;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  currentStep,
  totalSteps,
  onComplete,
  onStartTour,
  onReset,
  showResetButton
}) => {
  return (
    <>
      {/* Indicadores de paso - CENTRADOS */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep ? 'bg-white w-8' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Botón de reinicio */}
      {showResetButton && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-8 right-8 p-3 rounded-full 
            bg-white/10 hover:bg-white/20 backdrop-blur-sm 
            group transition-all duration-300"
          onClick={onReset}
        >
          <RotateCcw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
        </motion.button>
      )}

      {/* Botón de continuar/saltar - MEJORADO Y VERIFICANDO FUNCIONALIDAD */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 right-8 px-6 py-3 rounded-full 
          bg-amber-500 hover:bg-amber-600 backdrop-blur-sm 
          flex items-center gap-3 group transition-all duration-300
          border border-amber-400/50 shadow-lg"
        onClick={() => {
          console.log("Botón IR AL MAPA clickeado");
          if (currentStep === totalSteps - 1) {
            console.log("Ejecutando onStartTour");
            onStartTour();
          } else {
            console.log("Ejecutando onComplete");
            onComplete();
          }
        }}
      >
        <span className="text-white font-medium">
          {currentStep === totalSteps - 1 ? 'Iniciar Recorrido' : 'IR AL MAPA'}
        </span>
        <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </>
  );
};

export default DemoControls;