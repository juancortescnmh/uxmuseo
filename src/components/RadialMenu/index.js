import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/RadialMenu/index.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialMenuDefs } from './defs';
import { MENU_CONFIG } from './config';
import { radialHelpers } from './helpers';
import MacroSection from './MacroSection';
import DeptSection from './DeptSection';
import MemorySection from './MemorySection';
import CenterSection from './CenterSection';
const RadialMenu = ({ onSelect, onStartTour, onResetView, isDemoMode = false, highlightSection, selectedMacro: propSelectedMacro = null, revealStage = 3 // Por defecto todas las secciones están visibles
 }) => {
    const [selectedMacro, setSelectedMacro] = useState(propSelectedMacro);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    // Transiciones para el efecto de revelación
    const [showMacro, setShowMacro] = useState(revealStage >= 1);
    const [showDept, setShowDept] = useState(revealStage >= 2);
    const [showMemory, setShowMemory] = useState(revealStage >= 3);
    // Efecto de entrada (fade-in) y revelación progresiva tipo cebolla
    useEffect(() => {
        setIsVisible(true);
        // Inicialmente solo mostramos el centro y macroregiones
        setShowMacro(true);
        setShowDept(false);
        setShowMemory(false);
        // Revelación progresiva cuando se selecciona una macroregión
        if (selectedMacro) {
            setShowDept(true);
        }
        else {
            // Si no hay macroregión seleccionada, ocultamos las otras secciones
            setShowDept(false);
            setShowMemory(false);
            setSelectedDepartment(null);
        }
        return () => {
            setIsVisible(false);
        };
    }, [selectedMacro]);
    // Mostrar la sección de memoria cuando se selecciona un departamento
    useEffect(() => {
        if (selectedDepartment) {
            setShowMemory(true);
        }
        else {
            setShowMemory(false);
        }
    }, [selectedDepartment]);
    // Sincronizar el estado local con la prop cuando cambia
    useEffect(() => {
        setSelectedMacro(propSelectedMacro);
    }, [propSelectedMacro]);
    const handleMacroSelect = (type, id) => {
        if (id === 'center') {
            // Si tenemos una función para resetear vista, la usamos
            if (onResetView) {
                onResetView();
            }
            else {
                onSelect(type, id);
            }
            return;
        }
        // En lugar de actualizar el estado directamente, delegamos esa responsabilidad
        // al componente padre a través de la función onSelect
        onSelect(type, id);
    };
    const handleDeptSelect = (type, id) => {
        // Actualizamos el estado local para mostrar la sección de memoria
        setSelectedDepartment(id);
        // Mostramos inmediatamente la sección de memoria
        setShowMemory(true);
        // Notificamos al componente padre
        onSelect(type, id);
    };
    const handleMemorySelect = (type, id) => {
        onSelect(type, id);
    };
    // Clic en el centro
    const handleCenterClick = () => {
        // Si hay un departamento seleccionado, lo deseleccionamos
        if (selectedDepartment) {
            setSelectedDepartment(null);
            setShowMemory(false);
            // Volvemos al nivel de macroregión
            if (selectedMacro) {
                onSelect('macro', selectedMacro);
            }
            return;
        }
        // Si estamos en modo demo y hay una función para iniciar el tour, la llamamos
        if (isDemoMode && onStartTour) {
            onStartTour();
        }
        else if (onResetView) {
            // Al dar click al centro de la rueda en 'lugares de memoria' nos devuelve 
            // a ver el mapa completo de colombia para empezar un nuevo recorrido desde 0
            onResetView();
        }
        else {
            // En modo normal, seleccionamos el centro como una región
            onSelect('macro', 'center');
        }
    };
    // Para los cálculos
    const center = MENU_CONFIG.dimensions.viewBox.center;
    const circleRadius = MENU_CONFIG.dimensions.rings.memory.outer + 10;
    // Variantes de animación para el efecto de cebolla
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
                when: "beforeChildren"
            }
        }
    };
    return (_jsx("div", { className: `
        ${isDemoMode
            ? 'fixed inset-0 flex items-center justify-center z-50 demo-radial-menu'
            : 'radial-menu-container'}
        transition-opacity duration-700 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `, children: _jsxs(motion.div, { className: `relative ${isDemoMode ? 'transform scale-110' : 'transform scale-0.8'}`, initial: "hidden", animate: "visible", variants: containerVariants, children: [_jsxs("svg", { width: MENU_CONFIG.dimensions.viewBox.width, height: MENU_CONFIG.dimensions.viewBox.height, viewBox: `0 0 ${MENU_CONFIG.dimensions.viewBox.width} ${MENU_CONFIG.dimensions.viewBox.height}`, style: { filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.2))' }, children: [_jsx(RadialMenuDefs, {}), _jsxs(AnimatePresence, { children: [showMacro && !showDept && !showMemory && (_jsx(motion.circle, { cx: center, cy: center, initial: { r: MENU_CONFIG.dimensions.rings.macro.outer + 15 }, animate: { r: MENU_CONFIG.dimensions.rings.macro.outer + 15 }, exit: { r: 0 }, fill: "rgba(255,255,255,0.05)", stroke: "rgba(255,255,255,0.2)", strokeWidth: 0.5, style: { filter: 'url(#glass)' }, transition: { duration: 0.5 } })), showMacro && showDept && !showMemory && (_jsx(motion.circle, { cx: center, cy: center, initial: { r: MENU_CONFIG.dimensions.rings.macro.outer + 15 }, animate: { r: MENU_CONFIG.dimensions.rings.department.outer + 15 }, exit: { r: MENU_CONFIG.dimensions.rings.macro.outer + 15 }, fill: "rgba(255,255,255,0.05)", stroke: "rgba(255,255,255,0.2)", strokeWidth: 0.5, style: { filter: 'url(#glass)' }, transition: { duration: 0.5 } })), showMacro && showDept && showMemory && (_jsx(motion.circle, { cx: center, cy: center, initial: { r: MENU_CONFIG.dimensions.rings.department.outer + 15 }, animate: { r: circleRadius }, exit: { r: MENU_CONFIG.dimensions.rings.department.outer + 15 }, fill: "rgba(255,255,255,0.05)", stroke: "rgba(255,255,255,0.2)", strokeWidth: 0.5, style: { filter: 'url(#glass)' }, transition: { duration: 0.5 } }))] }), showMemory && (_jsx(motion.g, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.4, delay: 0.1 }, children: Array.from({ length: 30 }).map((_, i) => {
                                const angle = i * 12; // 30 líneas distribuidas cada 12 grados
                                const innerRad = circleRadius - 15;
                                const outerRad = circleRadius + 5;
                                const start = radialHelpers.polarToCartesian(innerRad, angle, center, center);
                                const end = radialHelpers.polarToCartesian(outerRad, angle, center, center);
                                return (_jsx("line", { x1: start.x, y1: start.y, x2: end.x, y2: end.y, stroke: "rgba(255,255,255,0.1)", strokeWidth: 0.5 }, `line-${i}`));
                            }) })), _jsx(AnimatePresence, { children: showMacro && (_jsx(motion.g, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, transition: { duration: 0.5 }, children: _jsx(MacroSection, { selectedMacro: selectedMacro, hoveredItem: hoveredItem, highlightSection: highlightSection, onHover: setHoveredItem, onSelect: handleMacroSelect }) })) }), _jsx(AnimatePresence, { children: showDept && (_jsx(motion.g, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, transition: { duration: 0.5 }, children: _jsx(DeptSection, { selectedMacro: selectedMacro, hoveredItem: hoveredItem, highlightSection: highlightSection, onHover: setHoveredItem, onSelect: handleDeptSelect }) })) }), _jsx(AnimatePresence, { children: showMemory && (_jsx(motion.g, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, transition: { duration: 0.5 }, children: _jsx(MemorySection, { hoveredItem: hoveredItem, highlightSection: highlightSection, onHover: setHoveredItem, onSelect: handleMemorySelect, selectedDepartment: selectedDepartment }) })) }), _jsx(CenterSection, { highlightSection: highlightSection, onClick: handleCenterClick, isDemoMode: isDemoMode })] }), isDemoMode && revealStage < 3 && (_jsxs("div", { className: "absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-20 flex gap-2", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${revealStage >= 1 ? 'bg-white' : 'bg-white/40'}` }), _jsx("div", { className: `w-2 h-2 rounded-full ${revealStage >= 2 ? 'bg-white' : 'bg-white/40'}` }), _jsx("div", { className: `w-2 h-2 rounded-full ${revealStage >= 3 ? 'bg-white' : 'bg-white/40'}` })] }))] }) }));
};
export default RadialMenu;
