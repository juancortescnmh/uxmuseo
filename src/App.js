import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/App.tsx
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
// Componentes
import RadialMenu from './components/RadialMenu';
import Preloader from './components/Preloader';
import DemoMode from './components/demo/DemoMode';
import { LocationInfo } from './components/LocationInfo';
import { TourMessage } from './components/TourMessage';
import MapLoader from './components/MapLoader';
import { NavBar, SideButtons } from './components/NavComponents';
import LocationContext from './components/LocationContext';
import TourSelector from './components/TourSelector';
import ExilioGlobeView from './components/ExilioGlobeView';
import GuardianesMemoria from './components/GuardianesMemoria';
// Servicios
import { addEnvironmentEffects, setupMapLayers, updateLayersVisibility, animateCamera, navigateToRegion, navigateToDepartment, initializeMap, resetMap, startGuidedTour, drawAreaOfInterest, hideAreaOfInterest, cinematicLocationFocus, 
// Clustering
setupClusteredMarkers, updateVisibleMarkersWithClustering } from './services/MapService';
// Utilidades y datos
import { DemoStateManager, thematicTours } from './utils/demoState';
import { colombiaRegions, memoryTypes } from './data/regions';
import { memoryLocations } from './utils/mapHelpers';
import { loadRegionsGeoJSON, highlightRegion, getRegionNameForGeoJSON } from './utils/regionLoader';
mapboxgl.accessToken = 'pk.eyJ1IjoianVhbmVsbzY2Nzk2IiwiYSI6ImNtNzNmZ2pzbTA4bjIyaXEzZ2F3a2dnOHcifQ.Ew2kIfF9F-Q1ltBQ0xOf-g';
/**
 * Componente para agrupar los botones de información en la esquina inferior derecha
 */
const InfoButtons = ({ onInfoClick }) => {
    return (_jsx("div", { className: "fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4", children: _jsx("div", { className: "bg-black/50 backdrop-blur-md rounded-full p-1 \n                    shadow-lg border border-white/10 flex flex-col items-center", children: _jsx("button", { onClick: onInfoClick, className: "p-2.5 text-white hover:bg-white/10 rounded-full transition-all", title: "Informaci\u00F3n", children: _jsx(Info, { size: 22, className: "text-white" }) }) }) }));
};
export default function App() {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const markersRef = useRef({});
    const animationFrameRef = useRef();
    const lastFrameTime = useRef(0);
    const selectedMarkerRef = useRef(null);
    const mapLoadedRef = useRef(false);
    // AppState principal
    const [appState, setAppState] = useState({
        stage: 'preloader',
        selectedMacroRegion: null,
        selectedDepartment: null,
        selectedMemoryType: null,
        selectedLocation: null
    });
    // UI states
    const [activeLayers, setActiveLayers] = useState([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [droneActive, setDroneActive] = useState(false); // false => no gira
    const [mapError, setMapError] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [showLocationInfo, setShowLocationInfo] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isGuardianesOpen, setIsGuardianesOpen] = useState(false);
    // Estados para la carga del mapa
    const [mapProgress, setMapProgress] = useState(0);
    const [isMapFullyLoaded, setIsMapFullyLoaded] = useState(false);
    // Estado para mantener la ubicación actual para el componente de contexto
    const [currentLocation, setCurrentLocation] = useState({});
    // Filtrar sugerencias basadas en la consulta de búsqueda
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSuggestions([]);
            return;
        }
        const query = searchQuery.toLowerCase();
        const filteredLocations = memoryLocations.filter(location => {
            return (location.title.toLowerCase().includes(query) ||
                (location.description && location.description.toLowerCase().includes(query)) ||
                (location.code && location.code.toLowerCase().includes(query)) ||
                location.region.toLowerCase().includes(query) ||
                location.department.toLowerCase().includes(query) ||
                location.type.toLowerCase().includes(query));
        });
        // Limitar a 5 sugerencias para no saturar la UI
        setSuggestions(filteredLocations.slice(0, 5));
    }, [searchQuery]);
    /**
     * Mapa está listo
     */
    const handleMapReady = () => {
        // Iniciar un tiempo para incrementar gradualmente el progreso
        const totalLoadTime = 3000; // 3 segundos para asegurar carga completa
        const interval = 100; // Actualizar cada 100ms (menos frecuente)
        const steps = totalLoadTime / interval;
        const increment = 100 / steps;
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(progressInterval);
                // Primero cargar las capas básicas
                setTimeout(() => {
                    // Iniciar la configuración del mapa
                    addEnvironmentEffects(mapRef, mapLoadedRef);
                    // Cargar macroregiones
                    loadRegionsGeoJSON(mapRef, mapLoadedRef);
                    // Configurar la atenuación de regiones resaltadas basada en zoom
                    import('./utils/regionLoader').then(module => {
                        module.setupZoomBasedHighlighting(mapRef);
                    });
                    // Retrasar la carga de otras capas para evitar sobrecarga
                    setTimeout(() => {
                        // Configurar capas adicionales
                        setupMapLayers(mapRef, mapLoadedRef);
                        // Retrasar la carga de marcadores para evitar sobrecarga
                        setTimeout(() => {
                            // Configurar sistema de clustering para marcadores
                            setupClusteredMarkers(mapRef, mapLoadedRef, memoryLocations, handleMarkerClick);
                            // Actualizar marcadores según el estado actual
                            updateVisibleMarkersWithClustering(mapRef, mapLoadedRef, appState, handleMarkerClick);
                            // Marcar como completamente cargado
                            setIsMapFullyLoaded(true);
                        }, 500);
                    }, 500);
                }, 300);
            }
            setMapProgress(currentProgress);
        }, interval);
    };
    /**
     * Clic en un marcador
     */
    const handleMarkerClick = (location) => {
        setAppState(prev => ({
            ...prev,
            selectedLocation: location
        }));
        // Activar el panel de información detallada
        setShowLocationInfo(true);
        // Detener cualquier animación activa
        setDroneActive(false);
        // Volar al lugar de forma cinematográfica
        cinematicLocationFocus(mapRef, location);
        // Mostrar área de interés exactamente alrededor del punto del lugar de memoria
        drawAreaOfInterest(mapRef, mapLoadedRef, [location.longitude, location.latitude], 0.1 // Radio reducido para que siempre esté cerca del punto
        );
        // Marcarlo como seleccionado
        selectedMarkerRef.current = location.id;
    };
    /**
     * Manejar selección de sugerencia
     */
    const handleSuggestionSelect = (location) => {
        handleMarkerClick(location);
        setSearchQuery(location.title);
        setShowSuggestions(false);
    };
    /**
     * Manejar búsqueda
     */
    const handleSearch = (e) => {
        e.preventDefault();
        if (suggestions.length > 0) {
            handleSuggestionSelect(suggestions[0]);
        }
    };
    /**
     * Renderiza un mensaje de tour en un contenedor
     */
    const renderTourMessage = (props, container, onClose) => {
        const root = createRoot(container);
        root.render(_jsx(TourMessage, { title: props.title, message: props.message, location: props.location, isLastStep: props.isLastStep, onNext: props.onNext, skipFunction: props.skipFunction, onClose: () => {
                root.unmount();
                onClose();
            } }));
    };
    /**
     * Inicia Tour Guiado
     */
    async function startTour() {
        if (!mapRef.current || !mapLoadedRef.current)
            return;
        startGuidedTour(mapRef, mapLoadedRef, setDroneActive, setAppState, renderTourMessage, [], // Array vacío para indicar que use el tour por defecto
        handleDemoComplete // Pasar la función para saltar el demo
        );
    }
    /**
     * Iniciar mapa
     */
    useEffect(() => {
        if (!mapRef.current && mapContainerRef.current) {
            initializeMap(mapContainerRef, mapRef, mapLoadedRef, setIsMapLoaded, setMapError, droneActive, setDroneActive, handleMapReady);
        }
        return () => {
            // limpieza
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (mapRef.current) {
                console.log("Eliminando mapa al desmontar");
                mapRef.current.remove();
                mapRef.current = null;
                mapLoadedRef.current = false;
            }
        };
    }, []);
    /**
     * Animación de cámara (droneActive)
     */
    useEffect(() => {
        if (droneActive && mapRef.current && mapLoadedRef.current) {
            animationFrameRef.current = requestAnimationFrame((timestamp) => animateCamera(timestamp, mapRef, mapLoadedRef, droneActive, lastFrameTime, animationFrameRef, setDroneActive));
        }
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [droneActive]);
    // Actualizar marcadores cuando cambia el tipo de memoria seleccionado
    useEffect(() => {
        if (mapRef.current && mapLoadedRef.current) {
            // Reemplazar la función original con la versión de clustering
            updateVisibleMarkersWithClustering(mapRef, mapLoadedRef, appState, handleMarkerClick);
        }
    }, [appState.selectedMemoryType, appState.selectedMacroRegion, appState.selectedDepartment]);
    // Actualizar ubicación actual cuando cambie el estado de la aplicación
    useEffect(() => {
        // Actualizar información de ubicación basada en el estado actual
        const newLocation = {};
        if (appState.selectedMacroRegion) {
            newLocation.region = colombiaRegions[appState.selectedMacroRegion].name;
            if (appState.selectedDepartment) {
                const department = colombiaRegions[appState.selectedMacroRegion].departments.find(d => d.id === appState.selectedDepartment);
                if (department) {
                    newLocation.department = department.name;
                }
            }
        }
        if (appState.selectedLocation) {
            newLocation.name = appState.selectedLocation.title;
            newLocation.coordinates = [
                appState.selectedLocation.longitude,
                appState.selectedLocation.latitude
            ];
        }
        setCurrentLocation(newLocation);
    }, [appState.selectedMacroRegion, appState.selectedDepartment, appState.selectedLocation]);
    // Preloader -> Demo
    const handlePreloaderComplete = () => {
        setAppState(prev => ({ ...prev, stage: 'demo' }));
    };
    // Demo -> App
    const handleDemoComplete = () => {
        DemoStateManager.markDemoAsComplete();
        setAppState(prev => ({ ...prev, stage: 'app' }));
        // Si deseas rotar luego, setDroneActive(true);
    };
    // Manejar radial select
    const handleRadialSelect = (type, id) => {
        if (!mapRef.current || !mapLoadedRef.current)
            return;
        if (type === 'macro') {
            if (id === 'center') {
                startTour();
            }
            else {
                // Resaltar la región seleccionada
                highlightRegion(mapRef, getRegionNameForGeoJSON(id));
                navigateToRegion(id, mapRef, mapLoadedRef, setAppState);
            }
        }
        else if (type === 'department') {
            navigateToDepartment(id, appState, mapRef, mapLoadedRef, setAppState);
        }
        else if (type === 'memory') {
            setAppState(prev => ({
                ...prev,
                selectedMemoryType: prev.selectedMemoryType === id ? null : id
            }));
            // Actualizar el sistema de clustering con el nuevo filtro
            updateVisibleMarkersWithClustering(mapRef, mapLoadedRef, {
                ...appState,
                selectedMemoryType: appState.selectedMemoryType === id ? null : id
            }, handleMarkerClick);
        }
    };
    // on/off de capas (deforestation, mining, erosion)
    const handleToggleLayer = (layerId) => {
        const newActiveLayers = activeLayers.includes(layerId)
            ? activeLayers.filter((id) => id !== layerId)
            : [...activeLayers, layerId];
        const updatedLayers = updateLayersVisibility(mapRef, mapLoadedRef, newActiveLayers, handleMarkerClick);
        setActiveLayers(updatedLayers || newActiveLayers);
    };
    // Reiniciar mapa
    const handleResetMap = () => {
        resetMap(mapRef, mapContainerRef, markersRef, mapLoadedRef, setIsMapLoaded, setMapError, droneActive, setDroneActive, handleMapReady);
    };
    // Funciones para los controles de navegación
    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomIn();
        }
    };
    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomOut();
        }
    };
    const handleResetRotation = () => {
        if (mapRef.current) {
            mapRef.current.resetNorth();
        }
    };
    // Estados para controlar la visibilidad de componentes modales
    const [isTourSelectorOpen, setIsTourSelectorOpen] = useState(false);
    const [isExilioViewOpen, setIsExilioViewOpen] = useState(false);
    // Función para manejar la selección de un recorrido temático
    const handleTourSelect = (tourId) => {
        // Obtener el recorrido seleccionado
        const selectedTour = thematicTours.find(tour => tour.id === tourId);
        // Cerrar el selector
        setIsTourSelectorOpen(false);
        // Iniciar el recorrido con las ubicaciones específicas
        if (selectedTour && mapRef.current && mapLoadedRef.current) {
            console.log(`Iniciando recorrido: ${selectedTour.title}`);
            // Usar las ubicaciones específicas del tour seleccionado
            startGuidedTour(mapRef, mapLoadedRef, setDroneActive, setAppState, renderTourMessage, selectedTour.locations, // Pasamos las ubicaciones específicas
            handleDemoComplete // Pasar la función para saltar el demo
            );
        }
    };
    // Funciones para los botones de navegación
    const handleRouteClick = () => {
        // Abrir el selector de recorridos en lugar de iniciar directamente el tour
        setIsTourSelectorOpen(true);
    };
    const handleInfoClick = () => {
        console.log("Información");
        // Mostrar panel de información
    };
    const handleHelpClick = () => {
        console.log("Ayuda");
        // Mostrar panel de ayuda
    };
    const handleExilioClick = () => {
        // Abrir la vista del globo con los lugares del exilio
        setIsExilioViewOpen(true);
    };
    const handleGuardianesClick = () => {
        // Abrir el panel de Guardianes de la Memoria
        setIsGuardianesOpen(true);
    };
    const handleLocationClick = () => {
        console.log("Ubicación");
        // Zooming a ubicación actual
        if (mapRef.current && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                if (mapRef.current) {
                    mapRef.current.flyTo({
                        center: [position.coords.longitude, position.coords.latitude],
                        zoom: 14,
                        pitch: 60,
                        bearing: 0,
                        duration: 2000
                    });
                }
            }, (error) => {
                console.error("Error getting current position:", error);
            });
        }
    };
    const handleUserProfileClick = () => {
        console.log("Perfil de usuario");
        // Mostrar panel de perfil
    };
    return (_jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [_jsx("div", { ref: mapContainerRef, className: "absolute inset-0 map-container", style: { width: '100%', height: '100%', position: 'absolute' } }), _jsx(AnimatePresence, { children: isMapLoaded && !isMapFullyLoaded && (_jsx(MapLoader, { isLoading: true, progress: mapProgress })) }), appState.stage === 'preloader' && (_jsx(Preloader, { onStart: handlePreloaderComplete })), appState.stage === 'demo' && (_jsx(DemoMode, { onDemoComplete: handleDemoComplete, onStartTour: startTour, mapRef: mapRef, mapLoadedRef: mapLoadedRef })), (appState.stage === 'app' || appState.stage === 'tour') && isMapFullyLoaded && (_jsxs(_Fragment, { children: [_jsx(NavBar, { searchQuery: searchQuery, setSearchQuery: setSearchQuery, onSearch: handleSearch, onRouteClick: handleRouteClick, onInfoClick: handleInfoClick, onHelpClick: handleHelpClick, onLocationClick: handleLocationClick, onUserProfileClick: handleUserProfileClick, onExilioClick: handleExilioClick, onGuardianesClick: handleGuardianesClick, appState: appState, memoryLocations: memoryLocations, suggestions: suggestions, showSuggestions: showSuggestions, setShowSuggestions: setShowSuggestions, onSuggestionSelect: handleSuggestionSelect }), _jsx(SideButtons, { activeLayers: activeLayers, onToggleLayer: handleToggleLayer, onZoomIn: handleZoomIn, onZoomOut: handleZoomOut, onResetRotation: handleResetRotation }), appState.stage !== 'tour' && (_jsxs("div", { className: "flex flex-col items-center absolute bottom-20 right-20 z-40", children: [_jsx("div", { className: "radial-menu-container", children: _jsx(RadialMenu, { onSelect: handleRadialSelect, onStartTour: startTour, onResetView: () => resetMap(mapRef, mapContainerRef, markersRef, mapLoadedRef, setIsMapLoaded, setMapError, droneActive, setDroneActive, handleMapReady), isDemoMode: false, selectedMacro: appState.selectedMacroRegion }) }), Object.keys(currentLocation).length > 0 && (_jsx(LocationContext, { currentLocation: currentLocation, isActive: true }))] })), showLocationInfo && appState.selectedLocation && (_jsx(LocationInfo, { title: appState.selectedLocation.title, description: appState.selectedLocation.description || "Este lugar forma parte de la red de sitios documentados por el Centro Nacional de Memoria Histórica como espacios significativos en la construcción de la memoria colectiva.", code: appState.selectedLocation.code, region: appState.selectedLocation.region, type: appState.selectedLocation.type ? memoryTypes[appState.selectedLocation.type]?.name : "Lugar de Memoria", onClose: () => {
                            setShowLocationInfo(false);
                            hideAreaOfInterest(mapRef, mapLoadedRef);
                        } })), _jsx(InfoButtons, { onInfoClick: handleInfoClick }), mapError && (_jsx("div", { className: "absolute bottom-14 left-1/2 transform -translate-x-1/2\n                         bg-red-600/80 text-white px-4 py-2 rounded-lg max-w-md\n                         text-center z-[9999]", children: mapError })), _jsx(AnimatePresence, { children: isTourSelectorOpen && (_jsx(TourSelector, { isOpen: isTourSelectorOpen, onClose: () => setIsTourSelectorOpen(false), onSelectTour: handleTourSelect })) }), _jsx(ExilioGlobeView, { isOpen: isExilioViewOpen, onClose: () => setIsExilioViewOpen(false) }), _jsx(GuardianesMemoria, { isOpen: isGuardianesOpen, onClose: () => setIsGuardianesOpen(false) })] }))] }));
}
