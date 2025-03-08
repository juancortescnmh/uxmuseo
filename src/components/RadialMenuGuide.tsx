// src/components/RadialMenuGuide.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Map, Layers, Globe, Info, X, Target, ArrowRight, ChevronDown } from 'lucide-react';

interface RadialGuideStep {
  id: string;
  title: string;
  content: string[];
  position: 'center' | 'inner' | 'middle' | 'outer';
  highlightSection?: 'center' | 'macro' | 'department' | 'memory';
  icon?: React.ReactNode;
  arrow?: React.ReactNode;
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

  // Serie de pasos mejorada que guían al usuario sobre cómo usar el menú radial
  const guideSteps: RadialGuideStep[] = [
    {
      id: 'center',
      title: "Centro del Menú",
      content: [
        "El botón central inicia un recorrido guiado por los lugares de memoria más importantes de Colombia.",
        "",
        "👉 Haz clic aquí para comenzar el tour guiado"
      ],
      position: 'center',
      highlightSection: 'center',
      icon: <Target className="w-6 h-6 text-amber-400" />,
      arrow: <ChevronDown className="absolute -left-12 bottom-1/3 transform -rotate-90 text-amber-400 w-12 h-12 animate-pulse" />
    },
    {
      id: 'macro',
      title: "Macroregiones",
      content: [
        "El anillo interior muestra las 5 macroregiones de Colombia:",
        "• Región Andina: Centro montañoso",
        "• Región Caribe: Costa norte",
        "• Región Pacífica: Costa occidental",
        "• Región Amazonía: Selva tropical al sur",
        "• Región Orinoquía: Llanos orientales",
        "",
        "👉 Haz clic en una región para explorarla"
      ],
      position: 'inner',
      highlightSection: 'macro',
      icon: <Globe className="w-6 h-6 text-amber-400" />,
      arrow: <ArrowRight className="absolute -left-20 top-1/2 transform -rotate-45 text-amber-400 w-10 h-10 animate-pulse" />
    },
    {
      id: 'departments',
      title: "Departamentos",
      content: [
        "El anillo medio muestra los departamentos de la macroregión seleccionada.",
        "",
        "Cada departamento contiene diferentes lugares de memoria histórica documentados.",
        "",
        "👉 Selecciona un departamento para filtrar lugares específicos"
      ],
      position: 'middle',
      highlightSection: 'department',
      icon: <Map className="w-6 h-6 text-amber-400" />,
      arrow: <ArrowRight className="absolute -left-20 top-1/2 transform -rotate-135 text-amber-400 w-10 h-10 animate-pulse" />
    },
    {
      id: 'memory',
      title: "Tipos de Memoria",
      content: [
        "El anillo exterior muestra las categorías de lugares de memoria:",
        "",
        "• Caracterizados: Sitios documentados",
        "• Identificados: En investigación",
        "• En Solicitud: Propuestos",
        "• Lugares del Horror: Sitios de violaciones a DDHH",
        "• Espacios de Sanación: Lugares de reconciliación",
        "",
        "👉 Haz clic para filtrar por categoría"
      ],
      position: 'outer',
      highlightSection: 'memory',
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      arrow: <ArrowRight className="absolute -left-20 bottom-1/2 transform rotate-45 text-amber-400 w-10 h-10 animate-pulse" />
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
          className={`fixed z-[9998] max-w-[320px] ${getTooltipPosition()}`}
        >
          <div className="bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-xl border border-white/10">
            <div className="relative">
              {/* Header con título */}
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-amber-500/20 to-transparent">
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
                {guideSteps[currentStep].content.map((line, index) => (
                  <p key={index} className={`text-white/90 text-sm leading-relaxed ${line === "" ? "mb-2" : "mb-1"} ${line.startsWith("👉") ? "font-bold text-amber-300 mt-2" : ""} ${line.startsWith("•") ? "ml-2" : ""}`}>
                    {line}
                  </p>
                ))}
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
              
              {/* Flecha animada que apunta a la sección relevante */}
              {guideSteps[currentStep].arrow && (
                <div className="pointer-events-none">
                  {guideSteps[currentStep].arrow}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RadialMenuGuide;