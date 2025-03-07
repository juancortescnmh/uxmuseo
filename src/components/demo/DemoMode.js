import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/demo/DemoMode.tsx
import { useState, useEffect } from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import RadialMenu from '../RadialMenu';
import { DemoStateManager } from '../../utils/demoState';
import { loadRegionsGeoJSON, highlightRegion, getRegionNameForGeoJSON } from '../../utils/regionLoader';
import { colombiaRegions } from '../../data/regions';
import { motion } from 'framer-motion';
const DemoMode = ({ onDemoComplete, onStartTour, mapRef, mapLoadedRef }) => {
    const [currentSection, setCurrentSection] = useState('macro');
    const [showResetButton, setShowResetButton] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedMacro, setSelectedMacro] = useState(null);
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
    const handleMenuSelect = (type, id) => {
        // Implementar lógica basada en el tipo y ID
        if (type === 'macro' && id !== 'center') {
            // Gestionar la selección de macroregiones
            if (mapRef && mapRef.current && mapLoadedRef && mapLoadedRef.current) {
                // Resaltar la región seleccionada en el mapa
                highlightRegion(mapRef, getRegionNameForGeoJSON(id));
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
                }
                else {
                    // Seleccionar esta región
                    setSelectedMacro(id);
                    // Navegar a la región en el mapa
                    const region = colombiaRegions[id];
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
        }
        else if (id === 'center') {
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
    return (_jsxs("div", { className: "fixed inset-0 z-50", children: [_jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm" }), _jsxs("div", { className: "relative w-full h-full flex flex-col items-center justify-center", children: [selectedMacro ? (_jsx("div", { className: "absolute top-8 left-1/2 transform -translate-x-1/2", children: _jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "flex flex-col items-center gap-2", children: _jsxs("div", { className: "bg-black/60 backdrop-blur-md rounded-full px-4 py-2\n                  border border-white/15 shadow-lg text-white flex items-center gap-2", children: [_jsx(Layers, { size: 16, className: "text-amber-400" }), _jsxs("span", { className: "text-sm", children: ["Explorando ", _jsx("span", { className: "text-amber-300", children: colombiaRegions[selectedMacro]?.name || selectedMacro })] })] }) }) })) : null, _jsx("div", { className: "flex-1 flex flex-col items-center justify-center", children: _jsx(RadialMenu, { onSelect: handleMenuSelect, onStartTour: onStartTour, isDemoMode: true, highlightSection: currentSection, selectedMacro: selectedMacro }) }), _jsxs("div", { className: "absolute bottom-12 w-full px-8 flex justify-between items-center", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: `w-16 h-2 rounded-full transition-all ${currentStep === 0 ? 'bg-white' : 'bg-white/20'}` }), _jsx("div", { className: `w-8 h-2 rounded-full transition-all ${currentStep === 1 ? 'bg-white' : 'bg-white/20'}` }), _jsx("div", { className: `w-8 h-2 rounded-full transition-all ${currentStep === 2 ? 'bg-white' : 'bg-white/20'}` }), _jsx("div", { className: `w-8 h-2 rounded-full transition-all ${currentStep === 3 ? 'bg-white' : 'bg-white/20'}` })] }), _jsxs("button", { onClick: handleSkipDemo, className: "px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 \n              backdrop-blur-sm flex items-center gap-3 group transition-all duration-300", children: [_jsx("span", { className: "text-white", children: "Ir al mapa" }), _jsx(ChevronRight, { className: "w-5 h-5 text-white group-hover:translate-x-1 transition-transform" })] })] })] })] }));
};
export default DemoMode;
