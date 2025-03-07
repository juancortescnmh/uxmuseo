import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { memoryTypes } from '../../data/regions';
import { MENU_CONFIG } from './config';
import { createArcPath, createTextArcPath, polarToCartesian } from './helpers';
const MemorySection = ({ hoveredItem, highlightSection, onHover, onSelect, selectedDepartment }) => {
    // Mapeo de departamentos a tipos de memoria (simulado)
    const deptMemoryMap = {
        // Pacífico
        'cauca': ['identificados', 'caracterizados', 'sanaciones'],
        'choco': ['identificados', 'horror', 'sanaciones'],
        'narino': ['solicitud', 'horror', 'sanaciones'],
        'valle_del_cauca': ['identificados', 'caracterizados', 'solicitud', 'horror'],
        // Amazonía
        'amazonas': ['identificados', 'sanaciones'],
        'caqueta': ['caracterizados', 'horror', 'sanaciones'],
        'guainia': ['solicitud', 'sanaciones'],
        'guaviare': ['identificados', 'horror'],
        'putumayo': ['caracterizados', 'solicitud', 'horror'],
        'vaupes': ['identificados', 'caracterizados'],
        // Andina
        'antioquia': ['identificados', 'caracterizados', 'solicitud', 'horror', 'sanaciones'],
        'boyaca': ['caracterizados', 'solicitud'],
        'caldas': ['identificados', 'horror'],
        'cundinamarca': ['caracterizados', 'solicitud', 'horror'],
        'huila': ['identificados', 'sanaciones'],
        'norte_de_santander': ['identificados', 'caracterizados', 'horror'],
        'quindio': ['caracterizados', 'sanaciones'],
        'risaralda': ['solicitud', 'horror'],
        'santander': ['identificados', 'caracterizados', 'solicitud'],
        'tolima': ['horror', 'sanaciones'],
        // Caribe
        'atlantico': ['identificados', 'solicitud'],
        'bolivar': ['caracterizados', 'horror'],
        'cesar': ['solicitud', 'sanaciones'],
        'cordoba': ['identificados', 'caracterizados', 'horror'],
        'la_guajira': ['caracterizados', 'solicitud'],
        'magdalena': ['identificados', 'horror', 'sanaciones'],
        'sucre': ['caracterizados', 'solicitud', 'horror'],
        // Orinoquía
        'arauca': ['identificados', 'caracterizados', 'solicitud'],
        'casanare': ['horror', 'sanaciones'],
        'meta': ['identificados', 'solicitud', 'sanaciones'],
        'vichada': ['caracterizados', 'horror']
    };
    // Determinar qué tipos de memoria mostrar según el departamento seleccionado
    let memoryTypesToShow;
    if (selectedDepartment && deptMemoryMap[selectedDepartment]) {
        // Filtramos los tipos de memoria para el departamento seleccionado
        memoryTypesToShow = Object.entries(memoryTypes).filter(([id]) => deptMemoryMap[selectedDepartment].includes(id));
    }
    else {
        // Si no hay departamento seleccionado o no hay datos, mostramos todos
        memoryTypesToShow = Object.entries(memoryTypes);
    }
    const itemCount = memoryTypesToShow.length;
    const anglePerItem = 360 / itemCount;
    // Ahora comprobamos los dos posibles valores para la sección resaltada
    const isHighlighted = highlightSection === 'lugares' || highlightSection === 'memory';
    const { outer, inner } = MENU_CONFIG.dimensions.rings.memory;
    const center = MENU_CONFIG.dimensions.viewBox.center;
    const textRadius = (outer + inner) / 2;
    const markerRadius = (outer + 10); // Radio para los pequeños marcadores circulares
    return (_jsx(_Fragment, { children: memoryTypesToShow.map(([id, type], index) => {
            const startAngle = index * anglePerItem;
            const endAngle = startAngle + anglePerItem;
            const isHovered = hoveredItem === `memory-${id}`;
            const midAngle = (startAngle + endAngle) / 2;
            // Posición para el pequeño marcador circular
            const markerPos = polarToCartesian(markerRadius, midAngle, center, center);
            // ID para path del texto
            const textArcId = `memory-textarc-${id}`;
            return (_jsxs(motion.g, { onMouseEnter: () => onHover(`memory-${id}`), onMouseLeave: () => onHover(null), onClick: () => onSelect('memory', id), style: { cursor: 'pointer' }, whileHover: { scale: 1.08, y: -5 }, whileTap: { scale: 0.95 }, transition: { duration: 0.2, type: "spring", stiffness: 300 }, children: [_jsx("defs", { children: _jsx("path", { id: textArcId, fill: "none", stroke: "none", d: createTextArcPath(startAngle, endAngle, textRadius, center, center) }) }), _jsx("path", { d: createArcPath(startAngle, endAngle, outer, inner, center, center), fill: "rgba(255,255,255,0.05)", stroke: "rgba(255,255,255,0.3)", strokeWidth: 0.5, className: `
                transition-all duration-300 ease-out
                ${(isHovered || isHighlighted) ? 'filter brightness-110' : ''}
              ` }), _jsx("circle", { cx: markerPos.x, cy: markerPos.y, r: 4, fill: type.color || "white", stroke: "rgba(0,0,0,0.1)", strokeWidth: 0.5, className: "transition-all duration-300", opacity: isHovered ? 1 : 0.9 }), _jsx("text", { fill: "white", fontSize: "8", fontWeight: "500", letterSpacing: "1", className: "uppercase", opacity: "0.9", children: _jsx("textPath", { href: `#${textArcId}`, startOffset: "50%", textAnchor: "middle", children: id === 'solicitud' ? 'En solicitud' :
                                id === 'horror' ? 'Del horror' :
                                    type.name }) })] }, `memory-${id}`));
        }) }));
};
export default MemorySection;
