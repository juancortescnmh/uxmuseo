// src/components/demo/DemoMode.tsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, Info, MapPin, Layers } from 'lucide-react';
import RadialMenu from '../RadialMenu';
import StepByStepGuide from './StepByStepGuide';
import { DemoStateManager } from '../../utils/demoState';
import { loadRegionsGeoJSON, highlightRegion, getRegionNameForGeoJSON } from '../../utils/regionLoader';
import { colombiaRegions, type MacroRegion } from '../../data/regions';
import { navigateToRegion } from '../../services/MapService';
import { motion } from 'framer-motion';

interface DemoModeProps {
  onDemoComplete: () => void;
  onStartTour: () => void;
  mapRef?: React.MutableRefObject<mapboxgl.Map | null>;
  mapLoadedRef?: React.MutableRefObject<boolean>;
}

const DemoMode: React.FC<DemoModeProps> = ({ 
  onDemoComplete, 
  onStartTour,
  mapRef,
  mapLoadedRef
}) => {
  const [currentSection, setCurrentSection] = useState<'macro' | 'department' | 'memory' | 'center'>('macro');
  const [showResetButton, setShowResetButton] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMacro, setSelectedMacro] = useState<MacroRegion | null>(null);
  const [showRadialGuide, setShowRadialGuide] = useState(true); // Mostrar la guía del menú radial por defecto

  // Efecto para el zoom inicial al país y cargar regiones
  useEffect(() => {
    // Verificamos que las referencias existan y tengan valores válidos
    if (mapRef && mapRef.current && mapLoadedRef && mapLoadedRef.current) {
      console.log("Iniciando zoom out para vista de Colombia");
      
      // Cargar las regiones de Colombia
      loadRegionsGeoJSON(mapRef, mapLoadedRef);
      
      // Hacer zoom out inicial para ver todo Colombia
      mapRef.current.flyTo({
        center: [-73.5, 4.5], // Centro de Colombia
        zoom: 4.5, // Zoom alejado para ver todo el país
        pitch: 0,
        bearing: 0,
        duration: 3000
      });
      
      // Después de unos segundos, hacer un zoom más cercano
      setTimeout(() => {
        if (mapRef && mapRef.current) {
          mapRef.current.flyTo({
            center: [-73.5, 4.5],
            zoom: 5.5, // Zoom más cercano pero que aún muestre el país
            pitch: 30,
            bearing: 0,
            duration: 3000
          });
        }
      }, 3000);
    }
  }, [mapRef, mapLoadedRef]);

  useEffect(() => {
    const timer = setTimeout(() => setShowResetButton(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleMenuSelect = (type: 'macro' | 'department' | 'memory', id: string) => {
    // Implementar lógica basada en el tipo y ID
    if (type === 'macro' && id !== 'center') {
      // Gestionar la selección de macroregiones
      if (mapRef && mapRef.current && mapLoadedRef && mapLoadedRef.current) {
        // Resaltar la región seleccionada en el mapa
        highlightRegion(mapRef, getRegionNameForGeoJSON(id as MacroRegion));
        
        // Si ya está seleccionada esta región, la deseleccionamos
        if (selectedMacro === id) {
          setSelectedMacro(null);
          // Restablecer la vista del mapa al zoom general de Colombia
          mapRef.current.flyTo({
            center: [-73.5, 4.5], // Centro de Colombia
            zoom: 5.5,
            pitch: 30,
            bearing: 0,
            duration: 2000
          });
        } else {
          // Seleccionar esta región
          setSelectedMacro(id as MacroRegion);
          
          // Navegar a la región en el mapa
          const region = colombiaRegions[id as MacroRegion];
          if (region && region.center) {
            mapRef.current.flyTo({
              center: region.center,
              zoom: 6.5,
              pitch: 45,
              bearing: 0,
              duration: 2000
            });
          }
        }
      }
    } else if (id === 'center') {
      // Iniciar recorrido cuando se selecciona el centro
      onStartTour();
    }
    
    // Avanzar al siguiente paso para fines de demostración
    switch (currentSection) {
      case 'macro':
        setCurrentSection('department');
        setCurrentStep(1);
        break;
      case 'department':
        setCurrentSection('memory');
        setCurrentStep(2);
        break;
      case 'memory':
        setCurrentSection('center');
        setCurrentStep(3);
        break;
      case 'center':
        // No hacemos nada aquí, ya que ahora el inicio del tour
        // se maneja en el handleCenterClick del RadialMenu
        break;
    }
  };

  // Esta función se llama cuando se hace clic en "Ir al mapa"
  const handleSkipDemo = () => {
    try {
      console.log("Ir al mapa: Completando el demo y pasando a la vista principal");
      
      // Marca el demo como completado en localStorage
      DemoStateManager.markDemoAsComplete(); 
      
      // IMPORTANTE: Añadir un mensaje visual para que el usuario sepa que se está procesando su acción
      const overlay = document.createElement('div');
      overlay.id = 'demo-skip-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
      `;
      
      const message = document.createElement('div');
      message.style.cssText = `
        background-color: rgba(0,0,0,0.8);
        color: white;
        padding: 20px 40px;
        border-radius: 8px;
        font-size: 18px;
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(5px);
      `;
      message.textContent = 'Cargando mapa...';
      
      overlay.appendChild(message);
      document.body.appendChild(overlay);
      
      // Pequeño retraso para asegurar que el overlay se muestre antes de la transición
      setTimeout(() => {
        // DEBUG: Log antes de llamar a onDemoComplete
        console.log("Por llamar a onDemoComplete:", onDemoComplete);
        
        // MUESTRA DIRECTA SIN VERIFICACIONES
        onDemoComplete();
        console.log("onDemoComplete fue llamado");
      }, 300);
    } catch (error) {
      console.error("ERROR en handleSkipDemo:", error);
      alert("Error al intentar ir al mapa. Por favor, intenta de nuevo.");
    }
  };

  const handleResetDemo = () => {
    DemoStateManager.resetDemoState();
    setCurrentSection('macro');
    setCurrentStep(0);
    setSelectedMacro(null);
    
    // Resetear el mapa a la vista inicial
    if (mapRef && mapRef.current) {
      // Eliminar resaltado de regiones
      highlightRegion(mapRef, null);
      
      // Volver a la vista general
      mapRef.current.flyTo({
        center: [-73.5, 4.5],
        zoom: 5.5,
        pitch: 30,
        bearing: 0,
        duration: 2000
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo oscuro con blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Título principal */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/60 backdrop-blur-md rounded-lg px-6 py-4 flex flex-col items-center gap-3 border border-white/10">
          <h1 className="text-white text-2xl font-bold">Mapa de la Memoria Histórica</h1>
          <p className="text-white/80 text-center max-w-md">
            Utiliza el menú radial para explorar las macroregiones, departamentos y tipos de lugares de memoria histórica de Colombia.
          </p>
        </div>
      </div>

      {/* Contenedor principal centrado */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Eliminamos el título duplicado, ya que aparece en el centro de la rueda */}

        {/* Navegación por capas en el centro arriba del menú */}
        {selectedMacro ? (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2
                  border border-white/15 shadow-lg text-white flex items-center gap-2">
                <Layers size={16} className="text-amber-400" />
                <span className="text-sm">
                  Explorando <span className="text-amber-300">{colombiaRegions[selectedMacro]?.name || selectedMacro}</span>
                </span>
              </div>
            </motion.div>
          </div>
        ) : null}

        {/* Menú Radial */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <RadialMenu
            onSelect={handleMenuSelect}
            onStartTour={() => {
              console.log("Demo Mode - Botón de inicio de tour presionado");
              if (onStartTour) onStartTour();
            }} // Pasar la función para iniciar el tour
            isDemoMode={true}
            highlightSection={currentSection}
            selectedMacro={selectedMacro}
          />
          
          {/* Guía paso a paso potente a la derecha del menú radial */}
          <StepByStepGuide
            currentSection={currentSection}
            selectedMacro={selectedMacro}
            currentStep={currentStep}
            onSkipDemo={handleSkipDemo}
          />
        </div>

        {/* Controles inferiores */}
        <div className="absolute bottom-20 w-full flex flex-col items-center gap-8">
          {/* Indicadores de progreso centrados */}
          <div className="flex gap-2">
            <div className={`w-16 h-2 rounded-full transition-all ${currentStep === 0 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 1 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 2 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 3 ? 'bg-white' : 'bg-white/20'}`} />
          </div>
          
          {/* Botón de Ir al mapa GRANDE y CENTRADO */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                console.log("Botón Ir al mapa presionado");
                handleSkipDemo();
              }}
              className="px-10 py-5 rounded-full bg-amber-500 hover:bg-amber-600 
                backdrop-blur-sm flex items-center gap-4 group transition-all duration-300
                border-2 border-amber-400/50 shadow-xl animate-pulse"
            >
              <span className="text-white font-bold text-xl">IR AL MAPA</span>
              <ChevronRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Eliminamos el botón de la esquina superior derecha */}
      </div>
    </div>
  );
};

export default DemoMode;