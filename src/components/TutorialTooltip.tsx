// src/components/TutorialTooltip.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Map, Layers, Globe, Info, X } from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

interface TutorialTooltipProps {
  onClose: () => void;
  onComplete: () => void;
  isOpen: boolean;
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({ 
  onClose, 
  onComplete,
  isOpen 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Bienvenido al Mapa de Memoria",
      content: "Este mapa interactivo te permite explorar los sitios de memoria histórica de Colombia. Aprende a navegar con este breve tutorial.",
      icon: <Info className="w-6 h-6 text-amber-400" />
    },
    {
      title: "Macroregiones",
      content: "Colombia está dividida en macroregiones. Haz clic en los segmentos del anillo interior del menú radial para explorar una región específica.",
      icon: <Globe className="w-6 h-6 text-amber-400" />
    },
    {
      title: "Departamentos",
      content: "Cuando selecciones una macroregión, podrás explorar sus departamentos en el anillo medio del menú radial.",
      icon: <Map className="w-6 h-6 text-amber-400" />
    },
    {
      title: "Tipologías de Memoria",
      content: "El anillo exterior muestra las tipologías de lugares de memoria. Cada color representa una categoría diferente de sitio histórico.",
      icon: <Layers className="w-6 h-6 text-amber-400" />
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      setVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="fixed bottom-20 right-[360px] z-[9998] max-w-[280px]"
        >
          <div className="bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-xl border border-white/10">
            <div className="relative">
              {/* Header con título */}
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {tutorialSteps[currentStep].icon}
                  <h3 className="text-white font-medium text-sm">
                    {tutorialSteps[currentStep].title}
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
                  {tutorialSteps[currentStep].content}
                </p>
              </div>
              
              {/* Footer con navegación */}
              <div className="px-4 py-3 border-t border-white/10 flex justify-between items-center">
                {/* Indicadores de pasos */}
                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
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
                  {currentStep === tutorialSteps.length - 1 ? 'Terminar' : 'Siguiente'}
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              
              {/* Flecha apuntando al menú radial */}
              <div className="absolute -right-2 bottom-1/2 transform translate-y-1/2">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-black/80 border-b-[8px] border-b-transparent"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialTooltip;