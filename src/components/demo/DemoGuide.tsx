// src/components/demo/DemoGuide.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Map, Layers, Globe, Target, ArrowRight } from 'lucide-react';

interface DemoGuideProps {
  currentSection: 'macro' | 'department' | 'memory' | 'center';
  selectedMacro: string | null;
  currentStep: number;
  onSkipDemo: () => void;
}

const DemoGuide: React.FC<DemoGuideProps> = ({ 
  currentSection, 
  selectedMacro, 
  currentStep,
  onSkipDemo
}) => {
  const [visible, setVisible] = useState(true);

  // Obtener el mensaje adecuado según el paso actual
  const getMessage = () => {
    switch (currentSection) {
      case 'macro':
        return {
          title: "Explora las Macroregiones",
          content: "Haz clic en cualquiera de las regiones del anillo interno para explorar esa parte de Colombia.",
          position: "top-1/3 right-1/3",
          icon: <Globe className="w-6 h-6 text-amber-400" />,
          arrow: <ArrowRight className="absolute -right-10 top-1/2 transform rotate-45 text-amber-400" />
        };
      case 'department':
        return {
          title: "Selecciona un Departamento",
          content: `Ahora puedes elegir un departamento específico dentro de la macroregión ${selectedMacro || 'seleccionada'}.`,
          position: "bottom-1/3 left-1/3",
          icon: <Map className="w-6 h-6 text-amber-400" />,
          arrow: <ArrowRight className="absolute -left-10 top-1/2 transform -rotate-135 text-amber-400" />
        };
      case 'memory':
        return {
          title: "Tipos de Lugares de Memoria",
          content: "En el anillo exterior puedes filtrar por categorías de lugares de memoria como caracterizados, identificados, etc.",
          position: "bottom-1/3 right-1/3", 
          icon: <Layers className="w-6 h-6 text-amber-400" />,
          arrow: <ArrowRight className="absolute -right-10 top-1/2 transform rotate-135 text-amber-400" />
        };
      case 'center':
        return {
          title: "Iniciar Recorrido Guiado",
          content: "El centro te permite iniciar un recorrido guiado por los lugares de memoria más importantes de Colombia.",
          position: "top-1/3 left-1/2 transform -translate-x-1/2",
          icon: <Target className="w-6 h-6 text-amber-400" />,
          arrow: <ChevronDown className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 text-amber-400" />
        };
      default:
        return {
          title: "Explora el Mapa de Memoria",
          content: "Utiliza este menú interactivo para navegar por los diferentes lugares de memoria de Colombia.",
          position: "top-20 left-1/2 transform -translate-x-1/2",
          icon: <Map className="w-6 h-6 text-amber-400" />
        };
    }
  };

  const message = getMessage();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className={`fixed z-[9999] max-w-[280px] ${message.position}`}
        >
          <div className="bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-xl border border-white/10">
            <div className="relative">
              {/* Header con título */}
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {message.icon}
                  <h3 className="text-white font-medium text-sm">
                    {message.title}
                  </h3>
                </div>
              </div>
              
              {/* Contenido */}
              <div className="p-4">
                <p className="text-white/90 text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
              
              {/* Footer con skip */}
              <div className="px-4 py-3 border-t border-white/10 flex justify-between items-center">
                {/* Indicadores de progreso */}
                <div className="flex gap-1">
                  <div className={`h-1.5 w-4 rounded-full ${currentStep === 0 ? 'bg-amber-400' : 'bg-white/20'}`} />
                  <div className={`h-1.5 w-4 rounded-full ${currentStep === 1 ? 'bg-amber-400' : 'bg-white/20'}`} />
                  <div className={`h-1.5 w-4 rounded-full ${currentStep === 2 ? 'bg-amber-400' : 'bg-white/20'}`} />
                  <div className={`h-1.5 w-4 rounded-full ${currentStep === 3 ? 'bg-amber-400' : 'bg-white/20'}`} />
                </div>
                
                {/* Botón saltar - aún más visible y llamativo */}
                <button
                  onClick={() => {
                    console.log("Botón 'Ir al mapa' presionado desde DemoGuide");
                    if (typeof onSkipDemo === 'function') {
                      onSkipDemo();
                    } else {
                      console.error("onSkipDemo no es una función válida", onSkipDemo);
                      alert("Error: No se puede saltar al mapa. Por favor, usa el botón grande abajo.");
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-md"
                >
                  <span>IR AL MAPA</span>
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              
              {/* Flecha que apunta a la sección relevante */}
              {message.arrow}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoGuide;