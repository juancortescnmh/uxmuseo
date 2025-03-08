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
    console.log(`Selección en menú radial - Tipo: ${type}, ID: ${id}`);
    
    // Implementar lógica basada en el tipo y ID
    if (type === 'macro' && id !== 'center') {
      // Gestionar la selección de macroregiones
      if (mapRef && mapRef.current && mapLoadedRef && mapLoadedRef.current) {
        // Resaltar la región seleccionada en el mapa
        highlightRegion(mapRef, getRegionNameForGeoJSON(id as MacroRegion));
        
        // Si ya está seleccionada esta región, la deseleccionamos
        if (selectedMacro === id) {
          console.log(`Deseleccionando región: ${id}`);
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
          console.log(`Seleccionando región: ${id}`);
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
      console.log("====== SELECCIONADO CENTRO DEL MENÚ RADIAL - INICIANDO TOUR ======");
      
      // Mostrar mensaje visual antes de iniciar el tour
      const preTourMessage = document.createElement('div');
      preTourMessage.id = 'pre-tour-message';
      preTourMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0,0,0,0.9);
        color: white;
        padding: 30px;
        border-radius: 10px;
        font-size: 20px;
        text-align: center;
        z-index: 9999;
        max-width: 80%;
        border: 2px solid rgba(255,165,0,0.5);
        box-shadow: 0 0 30px rgba(0,0,0,0.7);
      `;
      preTourMessage.innerHTML = `
        <h2 style="margin-bottom: 15px; color: #ffb74d; font-size: 28px;">Lugares de Memoria</h2>
        <p>Estás a punto de comenzar un recorrido guiado por los lugares más significativos de la memoria histórica de Colombia.</p>
        <p style="margin-top: 15px;">Este viaje te permitirá conocer espacios dedicados a la verdad, la reparación y la no repetición.</p>
        <p style="margin-top: 20px; color: #ffb74d;">Preparando recorrido...</p>
      `;
      document.body.appendChild(preTourMessage);
      
      // Mostrar el mensaje por 3 segundos antes de iniciar el tour
      setTimeout(() => {
        if (preTourMessage) {
          preTourMessage.remove();
        }
        
        console.log("Llamando a onStartTour()");
        if (typeof onStartTour === 'function') {
          onStartTour();
        } else {
          console.error("ERROR: onStartTour no es una función");
        }
      }, 3000);
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
      
      // Retraso para asegurar que el overlay se muestre antes de la transición
      setTimeout(() => {
        // Verificación adicional para garantizar que onDemoComplete exista
        if (typeof onDemoComplete === 'function') {
          console.log("Ejecutando onDemoComplete para finalizar el demo");
          onDemoComplete();
          
          // Verificación adicional para asegurar la visibilidad del menú radial
          setTimeout(() => {
            const menuContainer = document.getElementById('menu-radial-container');
            if (menuContainer) {
              console.log("Asegurando visibilidad del menú radial");
              menuContainer.style.display = 'flex';
              menuContainer.style.opacity = '1';
              menuContainer.style.visibility = 'visible';
              menuContainer.style.pointerEvents = 'auto';
            }
            
            // Eliminar el overlay de carga después de la transición
            const overlay = document.getElementById('demo-skip-overlay');
            if (overlay) {
              overlay.style.opacity = '0';
              setTimeout(() => overlay.remove(), 300);
            }
          }, 1000);
        } else {
          console.error("Error: onDemoComplete no es una función válida");
          alert("Error al finalizar el demo. Por favor, recarga la página.");
        }
      }, 500);
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
        {/* Menú Radial en modo demo - centrado en la pantalla */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Menú radial con tutorial interactivo superpuesto */}
          <div className="relative">
            {/* TUTORIAL INTERACTIVO - GUÍA NUMERADA CON DESCRIPCIONES */}
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]">
              {/* 1. Centro */}
              <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-[180%]">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-amber-500 w-7 h-7 rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-amber-500/50 shadow-lg max-w-xs">
                    <h3 className="text-amber-400 font-bold text-base mb-1">Centro: Lugares de Memoria</h3>
                    <p className="text-white text-sm">
                      El botón central inicia un recorrido guiado por los lugares de memoria histórica más significativos de Colombia.
                    </p>
                  </div>
                </div>
                <div className="w-[2px] h-[50px] bg-amber-500 absolute top-[100%] left-1/2 -translate-x-1/2"></div>
              </div>
              
              {/* 2. Primer anillo: Macroregiones */}
              <div className="absolute top-[15%] left-[10%]">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500 w-7 h-7 rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-amber-500/50 shadow-lg max-w-xs">
                    <h3 className="text-amber-400 font-bold text-base mb-1">Macroregiones</h3>
                    <p className="text-white text-sm">
                      El primer anillo muestra las 5 macroregiones de Colombia: Andina, Caribe, Pacífico, Amazonía y Orinoquía. Selecciona una para explorarla.
                    </p>
                  </div>
                </div>
                <div className="w-[100px] h-[1px] bg-amber-500 absolute top-[50%] left-[100%]"></div>
              </div>
              
              {/* 3. Segundo anillo: Departamentos */}
              <div className="absolute top-[40%] right-[5%]">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500 w-7 h-7 rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-amber-500/50 shadow-lg max-w-xs">
                    <h3 className="text-amber-400 font-bold text-base mb-1">Departamentos</h3>
                    <p className="text-white text-sm">
                      El segundo anillo muestra los departamentos dentro de la macroregión seleccionada. Haz clic para filtrar por departamento.
                    </p>
                  </div>
                </div>
                <div className="w-[80px] h-[1px] bg-amber-500 absolute top-[50%] right-[100%]"></div>
              </div>
              
              {/* 4. Tercer anillo: Tipos de memoria */}
              <div className="absolute bottom-[15%] left-[10%]">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500 w-7 h-7 rounded-full flex items-center justify-center text-black font-bold text-sm">4</div>
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-amber-500/50 shadow-lg max-w-xs">
                    <h3 className="text-amber-400 font-bold text-base mb-1">Tipos de Memoria</h3>
                    <p className="text-white text-sm">
                      El anillo exterior muestra las categorías de lugares de memoria: Caracterizados, Identificados, En Solicitud, etc. Selecciona uno para filtrar.
                    </p>
                  </div>
                </div>
                <div className="w-[60px] h-[1px] bg-amber-500 absolute top-[30%] left-[100%]"></div>
              </div>
            </div>
            
            {/* El menú radial */}
            <RadialMenu
              onSelect={handleMenuSelect}
              onStartTour={() => {
                console.log("Demo Mode - Botón de inicio de tour presionado");
                if (onStartTour) onStartTour();
              }}
              isDemoMode={true}
              highlightSection={currentSection}
              selectedMacro={selectedMacro}
            />
          </div>
        </div>
        
        {/* Controles inferiores - CENTRADOS */}
        <div className="absolute bottom-20 w-full flex flex-col items-center gap-8">
          {/* Indicadores de progreso CENTRADOS */}
          <div className="flex justify-center gap-2">
            <div className={`w-16 h-2 rounded-full transition-all ${currentStep === 0 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 1 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 2 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-8 h-2 rounded-full transition-all ${currentStep === 3 ? 'bg-white' : 'bg-white/20'}`} />
          </div>
          
          {/* Botón IR AL MAPA grande y centrado */}
          <button
            onClick={handleSkipDemo}
            className="px-10 py-5 rounded-full bg-amber-500 hover:bg-amber-600 
              backdrop-blur-sm flex items-center gap-4 group transition-all duration-300
              border-2 border-amber-400/50 shadow-xl animate-pulse"
          >
            <span className="text-white font-bold text-xl">IR AL MAPA</span>
            <ChevronRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoMode;