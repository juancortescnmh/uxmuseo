// src/components/RadialMenuGuide.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Map, Layers, Globe, Info, X, Target } from 'lucide-react';

interface RadialGuideStep {
  id: string;
  title: string;
  content: string;
  position: 'center' | 'inner' | 'middle' | 'outer';
  highlightSection?: 'center' | 'macro' | 'department' | 'memory';
  icon?: React.ReactNode;
}

interface RadialMenuGuideProps {
  onClose: () => void;
  onComplete: () => void;
  isOpen: boolean;
  isDemoMode: boolean;
  setHighlightSection?: (section: 'center' | 'macro' | 'department' | 'memory') => void;
}

const RadialMenuGuide: React.FC<RadialMenuGuideProps> = ({ 
  onClose, 
  onComplete,
  isOpen,
  isDemoMode,
  setHighlightSection
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(isOpen);

  // Serie de pasos que guían al usuario sobre cómo usar el menú radial
  const guideSteps: RadialGuideStep[] = [
    {
      id: 'intro',
      title: "Mapa de Memoria Histórica",
      content: "Este mapa te permite explorar los lugares de memoria histórica de Colombia. Aprenderás a usar el menú radial para navegar por las diferentes regiones y tipos de lugares.",
      position: 'center',
      highlightSection: 'center',
      icon: <Info className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'center',
      title: "Centro del Menú",
      content: "El botón central te permite iniciar un recorrido guiado por los lugares de memoria más importantes de Colombia.",
      position: 'center',
      highlightSection: 'center',
      icon: <Target className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'macro',
      title: "Macroregiones",
      content: "El anillo interior muestra las macroregiones de Colombia. Haz clic en un segmento para explorar una región específica del país.",
      position: 'inner',
      highlightSection: 'macro',
      icon: <Globe className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'departments',
      title: "Departamentos",
      content: "El anillo medio muestra los departamentos dentro de la macroregión seleccionada. Selecciona uno para concentrarte en esa área.",
      position: 'middle',
      highlightSection: 'department',
      icon: <Map className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'memory',
      title: "Tipos de Memoria",
      content: "El anillo exterior muestra las categorías de lugares de memoria. Cada color representa un tipo diferente: caracterizados, identificados, solicitud, etc.",
      position: 'outer',
      highlightSection: 'memory',
      icon: <Layers className="w-6 h-6 text-amber-400" />
    }
  ];

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);
  
  // Efecto para cambiar la sección resaltada cuando cambia el paso
  useEffect(() => {
    if (setHighlightSection && visible) {
      const currentHighlight = guideSteps[currentStep].highlightSection;
      if (currentHighlight) {
        setHighlightSection(currentHighlight);
      }
    }
  }, [currentStep, visible, setHighlightSection]);

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      setVisible(false);
    }
  };

  // Determinar la posición del tooltip basado en isDemoMode
  const getTooltipPosition = () => {
    if (isDemoMode) {
      // Posición cuando el menú radial está en el centro (modo demo)
      const step = guideSteps[currentStep];
      switch (step.position) {
        case 'center':
          return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[200px]';
        case 'inner':
          return 'top-1/4 right-1/4';
        case 'middle':
          return 'bottom-1/3 left-1/4';
        case 'outer':
          return 'bottom-1/4 right-1/4';
        default:
          return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[200px]';
      }
    } else {
      // Posición cuando el menú radial está en la esquina (modo normal)
      return 'bottom-[350px] right-[120px]';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className={`fixed z-[9998] max-w-[280px] ${getTooltipPosition()}`}
        >
          <div className="bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-xl border border-white/10">
            <div className="relative">
              {/* Header con título */}
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {guideSteps[currentStep].icon}
                  <h3 className="text-white font-medium text-sm">
                    {guideSteps[currentStep].title}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Contenido */}
              <div className="p-4">
                <p className="text-white/90 text-sm leading-relaxed">
                  {guideSteps[currentStep].content}
                </p>
              </div>
              
              {/* Footer con navegación */}
              <div className="px-4 py-3 border-t border-white/10 flex justify-between items-center">
                {/* Indicadores de pasos */}
                <div className="flex gap-1">
                  {guideSteps.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Botón siguiente */}
                <button
                  onClick={handleNext}
                  className="text-white text-sm flex items-center gap-1 hover:text-amber-300 transition-colors"
                >
                  {currentStep === guideSteps.length - 1 ? 'Entendido' : 'Siguiente'}
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RadialMenuGuide;