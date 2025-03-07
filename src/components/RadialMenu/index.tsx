// src/components/RadialMenu/index.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialMenuDefs } from './defs';
import { MENU_CONFIG } from './config';
import { radialHelpers } from './helpers';
import MacroSection from './MacroSection';
import DeptSection from './DeptSection';
import MemorySection from './MemorySection';
import CenterSection from './CenterSection';
import { type MacroRegion } from '../../data/regions';

interface RadialMenuProps {
  onSelect: (type: 'macro' | 'department' | 'memory', id: string) => void;
  onStartTour?: () => void; // Función opcional para iniciar el tour
  onResetView?: () => void; // Nueva función para resetear la vista
  isDemoMode?: boolean;
  highlightSection?: 'macro' | 'department' | 'memory' | 'center';
  selectedMacro?: MacroRegion | null;
  revealStage?: number; // Nuevo: controla qué secciones están visibles (1: solo macro, 2: macro+dept, 3: todas)
}

const RadialMenu: React.FC<RadialMenuProps> = ({
  onSelect,
  onStartTour,
  onResetView,
  isDemoMode = false,
  highlightSection,
  selectedMacro: propSelectedMacro = null,
  revealStage = 3 // Por defecto todas las secciones están visibles
}) => {
  const [selectedMacro, setSelectedMacro] = useState<MacroRegion | null>(propSelectedMacro);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
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
    } else {
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
    } else {
      setShowMemory(false);
    }
  }, [selectedDepartment]);

  // Sincronizar el estado local con la prop cuando cambia
  useEffect(() => {
    setSelectedMacro(propSelectedMacro);
  }, [propSelectedMacro]);

  const handleMacroSelect = (type: 'macro', id: string) => {
    if (id === 'center') {
      // Si tenemos una función para resetear vista, la usamos
      if (onResetView) {
        onResetView();
      } else {
        onSelect(type, id);
      }
      return;
    }
    
    // En lugar de actualizar el estado directamente, delegamos esa responsabilidad
    // al componente padre a través de la función onSelect
    onSelect(type, id);
  };

  const handleDeptSelect = (type: 'department', id: string) => {
    // Actualizamos el estado local para mostrar la sección de memoria
    setSelectedDepartment(id);
    // Mostramos inmediatamente la sección de memoria
    setShowMemory(true);
    // Notificamos al componente padre
    onSelect(type, id);
  };

  const handleMemorySelect = (type: 'memory', id: string) => {
    onSelect(type, id);
  };

  // Clic en el centro
  const handleCenterClick = () => {
    // *** SIEMPRE INICIAR TOUR SI ESTÁ DISPONIBLE ***
    if (onStartTour) {
      console.log("🚀 INICIANDO TOUR DESDE CENTRO");
      alert("Iniciando recorrido guiado");
      onStartTour();
      return;
    }
    
    // Como respaldo, si no hay función de tour
    if (onResetView) {
      console.log("Reseteando vista");
      onResetView();
    } else {
      console.log("Seleccionando centro como una región");
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

  return (
    <div
      className={`
        ${isDemoMode 
          ? 'fixed inset-0 flex items-center justify-center z-50 demo-radial-menu' 
          : 'w-full h-full flex items-end justify-end radial-menu-non-demo'} 
        transition-opacity duration-300 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <motion.div 
        className={`relative ${isDemoMode ? 'transform scale-110' : 'transform scale-1.2'}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <svg
          width={MENU_CONFIG.dimensions.viewBox.width}
          height={MENU_CONFIG.dimensions.viewBox.height}
          viewBox={`0 0 ${MENU_CONFIG.dimensions.viewBox.width} ${MENU_CONFIG.dimensions.viewBox.height}`}
          style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.2))' }}
        >
          {/* Definiciones (gradientes, filtros, etc.) */}
          <RadialMenuDefs />

          {/* Fondo del menú radial - círculo exterior con borde suave que se expande */}
          <AnimatePresence>
            {/* Cuando solo está el centro y macroregiones */}
            {showMacro && !showDept && !showMemory && (
              <motion.circle
                cx={center}
                cy={center}
                initial={{ r: MENU_CONFIG.dimensions.rings.macro.outer + 15 }}
                animate={{ r: MENU_CONFIG.dimensions.rings.macro.outer + 15 }}
                exit={{ r: 0 }}
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={0.5}
                style={{ filter: 'url(#glass)' }}
                transition={{ duration: 0.5 }}
              />
            )}
            
            {/* Cuando está el centro, macroregiones y departamentos */}
            {showMacro && showDept && !showMemory && (
              <motion.circle
                cx={center}
                cy={center}
                initial={{ r: MENU_CONFIG.dimensions.rings.macro.outer + 15 }}
                animate={{ r: MENU_CONFIG.dimensions.rings.department.outer + 15 }}
                exit={{ r: MENU_CONFIG.dimensions.rings.macro.outer + 15 }}
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={0.5}
                style={{ filter: 'url(#glass)' }}
                transition={{ duration: 0.5 }}
              />
            )}
            
            {/* Cuando están todas las secciones */}
            {showMacro && showDept && showMemory && (
              <motion.circle
                cx={center}
                cy={center}
                initial={{ r: MENU_CONFIG.dimensions.rings.department.outer + 15 }}
                animate={{ r: circleRadius }}
                exit={{ r: MENU_CONFIG.dimensions.rings.department.outer + 15 }}
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={0.5}
                style={{ filter: 'url(#glass)' }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>

          {/* Líneas divisorias para las secciones exteriores - solo visibles cuando la sección de memoria está activa */}
          {showMemory && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {Array.from({ length: 30 }).map((_, i) => {
                const angle = i * 12; // 30 líneas distribuidas cada 12 grados
                const innerRad = circleRadius - 15;
                const outerRad = circleRadius + 5;
                const start = radialHelpers.polarToCartesian(innerRad, angle, center, center);
                const end = radialHelpers.polarToCartesian(outerRad, angle, center, center);
                return (
                  <line
                    key={`line-${i}`}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={0.5}
                  />
                );
              })}
            </motion.g>
          )}

          {/* Secciones del menú con AnimatePresence para controlar la revelación */}
          {/* Revelación en capas, como una cebolla desde el centro hacia afuera */}
          {/* Primero la capa de MacroSection (más interna) */}
          <AnimatePresence>
            {showMacro && (
              <motion.g
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "tween" }}
              >
                <MacroSection
                  selectedMacro={selectedMacro}
                  hoveredItem={hoveredItem}
                  highlightSection={highlightSection}
                  onHover={setHoveredItem}
                  onSelect={handleMacroSelect}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Luego la capa de DeptSection (intermedia) */}
          <AnimatePresence>
            {showDept && (
              <motion.g
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "tween" }}
              >
                <DeptSection
                  selectedMacro={selectedMacro}
                  hoveredItem={hoveredItem}
                  highlightSection={highlightSection}
                  onHover={setHoveredItem}
                  onSelect={handleDeptSelect}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Finalmente la capa de MemorySection (más externa) */}
          <AnimatePresence>
            {showMemory && (
              <motion.g
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "tween" }}
              >
                <MemorySection
                  hoveredItem={hoveredItem}
                  highlightSection={highlightSection}
                  onHover={setHoveredItem}
                  onSelect={handleMemorySelect}
                  selectedDepartment={selectedDepartment}
                />
              </motion.g>
            )}
          </AnimatePresence>

          <CenterSection
            highlightSection={highlightSection}
            onClick={handleCenterClick}
            isDemoMode={isDemoMode}
          />
        </svg>

        {/* Indicadores de progreso reposicionados cerca del centro de la rueda */}
        {isDemoMode && revealStage < 3 && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-20 flex gap-2">
            <div className={`w-2 h-2 rounded-full ${revealStage >= 1 ? 'bg-white' : 'bg-white/40'}`} />
            <div className={`w-2 h-2 rounded-full ${revealStage >= 2 ? 'bg-white' : 'bg-white/40'}`} />
            <div className={`w-2 h-2 rounded-full ${revealStage >= 3 ? 'bg-white' : 'bg-white/40'}`} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RadialMenu;