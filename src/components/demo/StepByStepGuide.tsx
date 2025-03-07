// src/components/demo/StepByStepGuide.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Map, Layers, Globe, Target, ArrowRight, Info, X } from 'lucide-react';

interface StepByStepGuideProps {
  currentSection: 'macro' | 'department' | 'memory' | 'center';
  selectedMacro: string | null;
  currentStep: number;
  onSkipDemo: () => void;
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({ 
  currentSection, 
  selectedMacro, 
  currentStep,
  onSkipDemo
}) => {
  const [currentGuideStep, setCurrentGuideStep] = useState(0);

  // Avanzar al siguiente paso automáticamente cuando cambia currentSection
  useEffect(() => {
    if (currentSection === 'macro') setCurrentGuideStep(0);
    if (currentSection === 'department') setCurrentGuideStep(1);
    if (currentSection === 'memory') setCurrentGuideStep(2);
    if (currentSection === 'center') setCurrentGuideStep(3);
  }, [currentSection]);

  // Guía detallada para cada paso
  const guideSteps = [
    {
      title: "Paso 1: Selecciona una Macroregión",
      content: [
        "En el círculo interior del menú radial encontrarás las 5 macroregiones de Colombia:",
        "• Región Andina: Centro montañoso del país",
        "• Región Caribe: Costa norte de Colombia",
        "• Región Pacífica: Costa occidental",
        "• Región Amazonía: Selva tropical al sur",
        "• Región Orinoquía: Llanos orientales",
        "",
        "👉 Haz clic en cualquier segmento para seleccionar esa región"
      ],
      highlightSection: 'macro',
      icon: <Globe className="w-6 h-6 text-amber-400" />,
      arrow: <ArrowRight className="absolute -left-20 top-1/2 transform -rotate-45 text-amber-400 w-12 h-12 animate-pulse" />
    },
    {
      title: "Paso 2: Explora los Departamentos",
      content: [
        "El círculo intermedio muestra los departamentos de la macroregión seleccionada.",
        "",
        "Cada departamento contiene diferentes lugares de memoria histórica documentados.",
        "",
        "👉 Haz clic en un departamento para filtrar los lugares de memoria específicos de esa zona"
      ],
      highlightSection: 'department',
      icon: <Map className="w-6 h-6 text-amber-400" />,
      arrow: <ArrowRight className="absolute -left-20 top-1/2 transform -rotate-135 text-amber-400 w-12 h-12 animate-pulse" />
    },
    {
      title: "Paso 3: Categorías de Memoria",
      content: [
        "El círculo exterior muestra los tipos de lugares de memoria:",
        "",
        "• Caracterizados: Sitios completamente documentados",
        "• Identificados: Sitios en proceso de investigación",
        "• En Solicitud: Lugares propuestos para investigación",
        "• Lugares del Horror: Sitios donde ocurrieron violaciones a DDHH",
        "• Espacios de Sanación: Lugares dedicados a la reconciliación",
        "",
        "👉 Selecciona un tipo para filtrar por esa categoría"
      ],
      highlightSection: 'memory',
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      arrow: <ArrowRight className="absolute -left-20 bottom-1/2 transform rotate-45 text-amber-400 w-12 h-12 animate-pulse" />
    },
    {
      title: "Paso 4: Centro del Menú",
      content: [
        "El botón central del menú radial te permite iniciar un recorrido guiado por los lugares más significativos de memoria histórica de Colombia.",
        "",
        "Este tour te llevará por varios sitios emblemáticos con información detallada sobre cada uno.",
        "",
        "👉 Haz clic en el centro para iniciar el recorrido guiado"
      ],
      highlightSection: 'center',
      icon: <Target className="w-6 h-6 text-amber-400" />,
      arrow: <ChevronDown className="absolute -left-10 bottom-1/3 transform -rotate-90 text-amber-400 w-12 h-12 animate-pulse" />
    }
  ];

  const currentGuide = guideSteps[currentGuideStep];

  // Función para avanzar al siguiente paso de la guía manualmente
  const handleNextStep = () => {
    if (currentGuideStep < guideSteps.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1);
    } else {
      setCurrentGuideStep(0); // Volver al primer paso al llegar al final
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="absolute right-8 top-1/2 transform -translate-y-1/2 max-w-sm w-full z-[9999]"
    >
      <div className="bg-black/80 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/15">
        <div className="relative">
          {/* Header con título */}
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-amber-500/20 to-transparent">
            <div className="flex items-center gap-3">
              {currentGuide.icon}
              <h3 className="text-white font-bold text-lg">
                {currentGuide.title}
              </h3>
            </div>
            <button 
              onClick={onSkipDemo}
              className="text-white/60 hover:text-white transition-colors"
              title="Saltar tutorial"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Contenido */}
          <div className="p-5">
            {currentGuide.content.map((line, index) => (
              <p key={index} className={`text-white/90 ${line === "" ? "mb-2" : "mb-1"} ${line.startsWith("👉") ? "font-bold text-amber-300 mt-2" : ""} ${line.startsWith("•") ? "ml-2" : ""}`}>
                {line}
              </p>
            ))}
          </div>
          
          {/* Footer con botones de navegación */}
          <div className="px-5 py-4 border-t border-white/10 flex justify-between items-center">
            {/* Indicadores de progreso */}
            <div className="flex gap-1">
              {guideSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentGuideStep ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {/* Botón para avanzar al siguiente paso */}
              <button
                onClick={handleNextStep}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
              
              {/* Botón saltar al mapa */}
              <button
                onClick={onSkipDemo}
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-1.5 rounded flex items-center gap-2 transition-colors shadow-md"
              >
                <span>IR AL MAPA</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Flecha animada que apunta a la sección relevante */}
          {currentGuide.arrow}
        </div>
      </div>
    </motion.div>
  );
};

export default StepByStepGuide;