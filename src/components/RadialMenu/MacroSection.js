import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { colombiaRegions } from '../../data/regions';
import { MENU_CONFIG } from './config';
import { createArcPath, createTextArcPath, createGradientId, } from './helpers';
const MacroSection = ({ selectedMacro, hoveredItem, highlightSection, onHover, onSelect }) => {
    const regionEntries = Object.entries(colombiaRegions);
    const itemCount = regionEntries.length;
    const anglePerItem = 360 / itemCount;
    const isHighlighted = highlightSection === 'macro';
    const { outer, inner } = MENU_CONFIG.dimensions.rings.macro;
    const center = MENU_CONFIG.dimensions.viewBox.center;
    // Radio donde va el texto (a la mitad del anillo)
    const textRadius = (outer + inner) / 2;
    return (_jsx(_Fragment, { children: regionEntries.map(([id, region], index) => {
            const startAngle = index * anglePerItem;
            const endAngle = startAngle + anglePerItem;
            const isHovered = hoveredItem === `macro-${id}`;
            const isSelected = selectedMacro === id;
            // Cuando hay una selección, solo la región seleccionada está activa
            // De lo contrario, todas están activas
            const isActive = !selectedMacro || isSelected;
            // Obtener colores específicos para cada región
            const colors = MENU_CONFIG.colors.macro[id];
            // ID único para el path del texto
            const textArcId = `macro-textarc-${id}`;
            return (_jsxs(motion.g, { onMouseEnter: () => onHover(`macro-${id}`), onMouseLeave: () => onHover(null), onClick: () => onSelect('macro', id), style: { cursor: 'pointer' }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.97 }, animate: {
                    opacity: isActive ? 1 : 0.2,
                    scale: isSelected ? 1.05 : 1,
                    filter: isActive ? 'brightness(1)' : 'brightness(0.6)'
                }, transition: { duration: 0.3, type: "spring", stiffness: 200 }, children: [_jsx("path", { d: createArcPath(startAngle, endAngle, outer, inner, center, center), fill: `url(#${createGradientId('macro', id)})`, stroke: "rgba(255,255,255,0.4)", strokeWidth: 0.5, className: `
                transition-all duration-300 ease-out
                ${isHovered || isHighlighted ? 'filter brightness-110' : ''}
                ${isSelected ? 'filter brightness-125' : ''}
              ` }), _jsx("defs", { children: _jsx("path", { id: textArcId, fill: "none", stroke: "none", d: createTextArcPath(startAngle, endAngle, textRadius, center, center) }) }), _jsx("text", { fill: "white", fontSize: "9", fontWeight: "600", letterSpacing: "1", className: "uppercase", children: _jsx("textPath", { href: `#${textArcId}`, startOffset: "50%", textAnchor: "middle", children: region.name }) })] }, `macro-${id}`));
        }) }));
};
export default MacroSection;
