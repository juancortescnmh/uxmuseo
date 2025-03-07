import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/NavComponents.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Map, Info, HelpCircle, MapPin, User, ChevronRight, Menu, X, Compass, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colombiaRegions, memoryTypes } from '../data/regions';
import { Logo } from './Logo';
import NotificacionesGuardianes from './NotificacionesGuardianes';
// Componente de navegación superior mejorado
export const NavBar = ({ searchQuery, setSearchQuery, onSearch, onRouteClick, onInfoClick, onHelpClick, onLocationClick, onUserProfileClick, onExilioClick, onGuardianesClick, appState, memoryLocations = [], suggestions = [], showSuggestions = false, setShowSuggestions = () => { }, onSuggestionSelect = () => { } }) => {
    const [scrolled, setScrolled] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    // Detectar scroll para cambiar estilos
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            }
            else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowSuggestions]);
    // Obtener color según tipo de memoria
    const getColorForType = (type) => {
        const colors = {
            identificados: "#FF9D4D",
            caracterizados: "#4CAF50",
            solicitud: "#2196F3",
            horror: "#F44336",
            sanaciones: "#9C27B0"
        };
        return colors[type] || "#FFFFFF";
    };
    return (_jsx("div", { className: `fixed top-0 left-0 z-50 transition-all duration-300 
      ${scrolled ? 'py-3 bg-black/70' : 'py-5 bg-gradient-to-b from-black/60 to-transparent'}`, children: _jsxs("div", { className: "px-6 flex items-center", style: { maxWidth: "fit-content" }, children: [_jsx("div", { className: "flex items-center", children: _jsx("div", { className: "mr-8", children: _jsx(Logo, {}) }) }), _jsx("div", { className: "hidden md:block w-72 mx-6", children: _jsxs("div", { className: "relative", children: [_jsxs("form", { onSubmit: onSearch, className: "relative", children: [_jsx("input", { ref: inputRef, type: "text", placeholder: "Buscar territorio de memoria", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onFocus: () => setShowSuggestions(true), className: "w-full py-2.5 pl-4 pr-10 bg-white/10 backdrop-blur-md \n                         border border-white/20 rounded-full text-white placeholder-white/60\n                         focus:outline-none focus:border-white/30 transition-all" }), searchQuery && (_jsx("button", { type: "button", onClick: () => {
                                            setSearchQuery('');
                                            setShowSuggestions(false);
                                        }, className: "absolute right-12 top-1/2 transform -translate-y-1/2 text-white/60\n                            hover:text-white/90 p-1 rounded-full transition-colors", children: _jsx(X, { size: 16 }) })), _jsx("button", { type: "submit", className: "absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-amber-500\n                          hover:bg-amber-600 rounded-full transition-colors", children: _jsx(Search, { size: 18, className: "text-white" }) })] }), _jsx(AnimatePresence, { children: showSuggestions && suggestions.length > 0 && (_jsx(motion.div, { ref: suggestionsRef, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.2 }, className: "absolute top-full left-0 right-0 mt-2 bg-black/70 backdrop-blur-lg\n                           rounded-lg overflow-hidden border border-white/10 shadow-xl z-50", children: _jsx("div", { className: "py-1 max-h-60 overflow-y-auto", children: suggestions.map((location) => (_jsxs("button", { onClick: () => onSuggestionSelect(location), className: "w-full px-4 py-3 text-left flex items-start hover:bg-white/10 transition-colors", children: [_jsx("div", { className: "flex-shrink-0 mr-3 mt-0.5", children: _jsx("div", { className: "w-3 h-3 rounded-full", style: {
                                                            backgroundColor: getColorForType(location.type)
                                                        } }) }), _jsxs("div", { className: "flex-grow", children: [_jsx("div", { className: "text-white font-medium", children: location.title }), _jsxs("div", { className: "text-white/60 text-sm flex flex-wrap gap-1 items-center", children: [location.code && (_jsx("span", { className: "bg-white/10 px-1.5 py-0.5 rounded text-xs", children: location.code })), _jsxs("span", { children: [location.region, " \u00B7 ", location.department] })] })] })] }, location.id))) }) })) })] }) }), _jsx(Breadcrumb, { items: getBreadcrumbItems(appState), className: `hidden md:flex transition-opacity duration-300 ml-6 ${scrolled ? 'opacity-100' : 'opacity-80'}` }), _jsxs("div", { className: "hidden md:flex items-center gap-3 ml-6", children: [_jsx(NavButton, { icon: _jsx(Map, { size: 18 }), label: "Recorrido", onClick: onRouteClick }), _jsx(NavButton, { icon: _jsx(Info, { size: 18 }), label: "Informaci\u00F3n", onClick: onInfoClick }), _jsx(NavButton, { icon: _jsx(HelpCircle, { size: 18 }), label: "Ayuda", onClick: onHelpClick }), _jsx(NavButton, { icon: _jsx(MapPin, { size: 18 }), label: "Ubicaci\u00F3n", onClick: onLocationClick }), _jsx(NavButton, { icon: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#EC4899", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M10 3.2A9 9 0 1 0 20.8 14a1 1 0 0 0-1-1H13a1 1 0 0 1-1-1V4.5a1 1 0 0 0-.5-.9 1 1 0 0 0-1.2.1L10 3.2Z" }), _jsx("path", { d: "M3 9h2" }), _jsx("path", { d: "M8 3.2V5" }), _jsx("path", { d: "M11 3h2" })] }), label: "Exilio", onClick: onExilioClick }), _jsx("div", { className: "mx-2", children: _jsx(NotificacionesGuardianes, { onClick: onGuardianesClick }) }), _jsx("button", { onClick: onUserProfileClick, className: "ml-2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full \n                     border border-white/10 transition-all", children: _jsx(User, { size: 20, className: "text-white" }) })] }), _jsx("div", { className: "md:hidden flex items-center ml-2", children: _jsx(MobileMenuButton, { onUserProfileClick: onUserProfileClick }) })] }) }));
};
// Botón de navegación con ícono y etiqueta
const NavButton = ({ icon, label, onClick }) => {
    return (_jsxs("button", { onClick: onClick, className: "flex flex-col items-center justify-center py-1.5 px-3 rounded-lg\n                 hover:bg-white/10 transition-colors", children: [_jsx("div", { className: "text-white/90", children: icon }), _jsx("span", { className: "text-white/80 text-xs mt-1.5", children: label })] }));
};
// Menú móvil
const MobileMenuButton = ({ onUserProfileClick }) => {
    const [open, setOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setOpen(!open), className: "p-2 bg-white/10 backdrop-blur-md rounded-full transition-all", children: open ? _jsx(X, { size: 22, className: "text-white" }) : _jsx(Menu, { size: 22, className: "text-white" }) }), _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "absolute top-full left-0 mt-2 ml-4 bg-black/80 backdrop-blur-md\n                      border border-white/10 rounded-lg w-48 overflow-hidden shadow-xl", children: _jsxs("div", { className: "py-2", children: [_jsx(MobileMenuItem, { icon: _jsx(Search, { size: 18 }), label: "Buscar" }), _jsx(MobileMenuItem, { icon: _jsx(Map, { size: 18 }), label: "Recorrido" }), _jsx(MobileMenuItem, { icon: _jsx(Info, { size: 18 }), label: "Informaci\u00F3n" }), _jsx(MobileMenuItem, { icon: _jsx(HelpCircle, { size: 18 }), label: "Ayuda" }), _jsx(MobileMenuItem, { icon: _jsx(MapPin, { size: 18 }), label: "Ubicaci\u00F3n" }), _jsx("div", { className: "border-t border-white/10 my-1" }), _jsx(MobileMenuItem, { icon: _jsx(User, { size: 18 }), label: "Perfil", onClick: () => {
                                    setOpen(false);
                                    onUserProfileClick();
                                } })] }) })) })] }));
};
// Elemento del menú móvil
const MobileMenuItem = ({ icon, label, onClick }) => {
    return (_jsxs("button", { className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors", onClick: onClick, children: [_jsx("div", { className: "text-white/90", children: icon }), _jsx("span", { className: "text-white text-sm", children: label })] }));
};
// Breadcrumb mejorado con estilo elegante
export const Breadcrumb = ({ items, className = '' }) => {
    if (items.length <= 1)
        return null;
    return (_jsx("nav", { className: `flex items-center ${className}`, "aria-label": "Breadcrumb", children: _jsx("ol", { className: "flex items-center gap-2", children: items.map((item, index) => (_jsxs(React.Fragment, { children: [index > 0 && (_jsx("li", { className: "flex items-center", children: _jsx(ChevronRight, { size: 14, className: "text-white/50" }) })), _jsx("li", { children: item.href ? (_jsx("a", { href: item.href, className: `text-sm hover:underline ${index === items.length - 1
                                ? 'text-amber-300 font-medium'
                                : 'text-white/80'}`, children: item.label })) : (_jsx("span", { className: `text-sm ${index === items.length - 1
                                ? 'text-amber-300 font-medium'
                                : 'text-white/80'}`, children: item.label })) })] }, index))) }) }));
};
// Componente para los botones laterales mejorados
export const SideButtons = ({ activeLayers, onToggleLayer, onZoomIn, onZoomOut, onResetRotation }) => {
    const [showLayersPanel, setShowLayersPanel] = useState(false);
    return (_jsxs("div", { className: "fixed bottom-8 left-8 z-40 flex flex-col items-start gap-4", children: [_jsx(AnimatePresence, { children: showLayersPanel && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: "absolute bottom-16 left-full ml-4 bg-black/70 backdrop-blur-md rounded-lg p-4 \n                      border border-white/10 w-64 shadow-lg", children: [_jsx("h3", { className: "text-white font-medium text-sm mb-3", children: "Capas Ambientales" }), _jsx("div", { className: "space-y-2", children: [
                                { id: 'deforestation', name: 'Deforestación', color: '#FF4444' },
                                { id: 'mining', name: 'Minería Ilegal', color: '#FF8C00' },
                                { id: 'erosion', name: 'Erosión del Suelo', color: '#2196F3' }
                            ].map(layer => {
                                const isActive = activeLayers.includes(layer.id);
                                return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-14 h-6 relative rounded-full transition-colors ${isActive ? 'bg-white/20' : 'bg-black/40'}`, onClick: () => onToggleLayer(layer.id), role: "checkbox", "aria-checked": isActive, tabIndex: 0, children: _jsx("div", { className: `absolute top-1 w-4 h-4 rounded-full transition-all ${isActive
                                                    ? `right-1 bg-${layer.color.substring(1)}`
                                                    : 'left-1 bg-white/40'}`, style: { backgroundColor: isActive ? layer.color : 'rgba(255,255,255,0.4)' } }) }), _jsx("span", { className: "text-white text-sm", children: layer.name })] }, layer.id));
                            }) })] })) }), _jsxs("button", { onClick: () => setShowLayersPanel(!showLayersPanel), className: "bg-black/50 backdrop-blur-md rounded-full px-4 py-2.5 \n                  flex items-center gap-2 shadow-lg text-white\n                  border border-white/10 transition-all hover:bg-black/60", children: [_jsx(Layers, { size: 18 }), _jsx("span", { children: "Capas" })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("button", { onClick: onZoomIn, className: "bg-black/50 backdrop-blur-md rounded-full p-2.5 \n                    shadow-lg text-white border border-white/10 \n                    hover:bg-black/60 transition-all", title: "Acercar", children: _jsx(ZoomIn, { size: 18 }) }), _jsx("button", { onClick: onZoomOut, className: "bg-black/50 backdrop-blur-md rounded-full p-2.5 \n                    shadow-lg text-white border border-white/10 \n                    hover:bg-black/60 transition-all", title: "Alejar", children: _jsx(ZoomOut, { size: 18 }) }), _jsx("button", { onClick: onResetRotation, className: "bg-black/50 backdrop-blur-md rounded-full p-2.5 \n                    shadow-lg text-white border border-white/10 \n                    hover:bg-black/60 transition-all", title: "Restablecer rotaci\u00F3n", children: _jsx(Compass, { size: 18 }) })] })] }));
};
// Función para construir los elementos del breadcrumb
function getBreadcrumbItems(appState) {
    const items = [{ label: 'Colombia', href: '#' }];
    if (appState.selectedMacroRegion) {
        const regionName = colombiaRegions[appState.selectedMacroRegion].name;
        items.push({ label: regionName, href: '#' });
        if (appState.selectedDepartment) {
            const region = colombiaRegions[appState.selectedMacroRegion];
            const department = region.departments.find(d => d.id === appState.selectedDepartment);
            if (department) {
                items.push({ label: department.name, href: '#' });
            }
        }
        if (appState.selectedMemoryType) {
            const typeName = memoryTypes[appState.selectedMemoryType]?.name;
            if (typeName) {
                items.push({ label: typeName, href: '#' });
            }
        }
    }
    if (appState.selectedLocation) {
        const locationName = appState.selectedLocation.title || 'Lugar de memoria';
        items.push({ label: locationName });
    }
    return items;
}
// Componente para los controles de zoom
const ZoomIn = ({ size }) => (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "8", x2: "12", y2: "16" }), _jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" })] }));
const ZoomOut = ({ size }) => (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" })] }));
