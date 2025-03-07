// src/components/demo/DemoMode.tsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, Info, MapPin, Layers } from 'lucide-react';
import RadialMenu from '../RadialMenu';
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
    console.log("Ir al mapa: Completando el demo y pasando a la vista principal");
    DemoStateManager.markDemoAsComplete(); // Marca el demo como completado en localStorage
    onDemoComplete(); // Llama a la función del componente padre para cambiar el estado
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
            onStartTour={onStartTour} // Pasar la función para iniciar el tour
            isDemoMode={true}
            highlightSection={currentSection}
            selectedMacro={selectedMacro}
          />
        </div>

        {/* Controles inferiores */}
        <div className="absolute bottom-12 w-full px-8 flex justify-between items-center">
          {/* Indicadores de progreso centrados en la parte inferior */}
          <div className="flex gap-2">
            <div className={`w-16 h-2 rounded-full transition-all ${currentStep === 0 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 1 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 2 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 3 ? 'bg-white' : 'bg-white/20'}`} />
          </div>
          
          {/* Botón de Ir al mapa en esquina inferior derecha */}
          <button
            onClick={handleSkipDemo}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 
              backdrop-blur-sm flex items-center gap-3 group transition-all duration-300"
          >
            <span className="text-white">Ir al mapa</span>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Eliminamos el botón de la esquina superior derecha */}
      </div>
    </div>
  );
};

export default DemoMode;